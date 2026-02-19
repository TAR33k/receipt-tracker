using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using ReceiptTracker.Core.Enums;
using ReceiptTracker.Core.Interfaces;

namespace ReceiptTracker.Functions;

public class ReceiptProcessorFunction
{
    private readonly IReceiptRepository _receiptRepository;
    private readonly IDocumentIntelligenceService _documentIntelligenceService;
    private readonly IBlobStorageService _blobStorageService;
    private readonly ILogger<ReceiptProcessorFunction> _logger;

    public ReceiptProcessorFunction(
        IReceiptRepository receiptRepository,
        IDocumentIntelligenceService documentIntelligenceService,
        IBlobStorageService blobStorageService,
        ILogger<ReceiptProcessorFunction> logger)
    {
        _receiptRepository = receiptRepository;
        _documentIntelligenceService = documentIntelligenceService;
        _blobStorageService = blobStorageService;
        _logger = logger;
    }

    /// <summary>
    /// Triggered when a file is uploaded to the receipts-quarantine container.
    /// </summary>
    [Function("ReceiptProcessor")]
    public async Task Run(
    [BlobTrigger("receipts-quarantine/{userId}/{fileName}", Connection = "AzureWebJobsStorage")]
        Stream receiptStream,
        string userId,
        string fileName)
    {
        var blobName = $"{userId}/{fileName}";
        _logger.LogInformation("ReceiptProcessor triggered. BlobName: {BlobName}", blobName);

        var filenameWithoutExtension = Path.GetFileNameWithoutExtension(fileName);
        if (!Guid.TryParse(filenameWithoutExtension, out var receiptId))
        {
            _logger.LogError("Could not parse receipt ID from blob filename: '{FileName}'", fileName);
            return;
        }

        var receipt = await _receiptRepository.GetByIdAsync(receiptId, userId);

        if (receipt is null)
        {
            _logger.LogError(
                "No receipt record found for ID {ReceiptId} and user '{UserId}'.",
                receiptId, userId);
            return;
        }

        receipt.Status = ReceiptStatus.Processing;
        await _receiptRepository.UpdateAsync(receipt);
        _logger.LogInformation("Receipt {ReceiptId} status set to Processing.", receiptId);

        var extractionResult = await _documentIntelligenceService.ExtractReceiptDataAsync(receiptStream);

        if (!extractionResult.Success)
        {
            receipt.Status = ReceiptStatus.Failed;
            receipt.ErrorMessage = extractionResult.ErrorMessage;
            receipt.ProcessedAt = DateTime.UtcNow;
            await _receiptRepository.UpdateAsync(receipt);
            _logger.LogWarning("Receipt {ReceiptId} processing failed: {Error}", receiptId, extractionResult.ErrorMessage);
            return;
        }

        receipt.MerchantName = extractionResult.MerchantName;
        receipt.MerchantNameConfidence = extractionResult.MerchantNameConfidence;
        receipt.TotalAmount = extractionResult.TotalAmount;
        receipt.TotalAmountConfidence = extractionResult.TotalAmountConfidence;
        receipt.Currency = extractionResult.Currency;
        receipt.TransactionDate = extractionResult.TransactionDate;
        receipt.TransactionDateConfidence = extractionResult.TransactionDateConfidence;
        receipt.Status = extractionResult.NeedsReview ? ReceiptStatus.NeedsReview : ReceiptStatus.Completed;
        receipt.ProcessedAt = DateTime.UtcNow;

        await _receiptRepository.UpdateAsync(receipt);

        _logger.LogInformation(
            "Receipt {ReceiptId} updated. Status: {Status}. Merchant: '{Merchant}'. Total: {Total} {Currency}.",
            receiptId, receipt.Status, receipt.MerchantName, receipt.TotalAmount, receipt.Currency);

        try
        {
            await _blobStorageService.MoveBlobToProcessedAsync(blobName);
            _logger.LogInformation("Blob '{BlobName}' moved to receipts-processed.", blobName);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to move blob '{BlobName}' to processed container.", blobName);
        }
    }
}
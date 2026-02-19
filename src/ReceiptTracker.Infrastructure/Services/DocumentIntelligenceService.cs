using Azure;
using Azure.AI.DocumentIntelligence;
using Microsoft.Extensions.Logging;
using ReceiptTracker.Core.Interfaces;
using ReceiptTracker.Core.Models;

namespace ReceiptTracker.Infrastructure.Services;

public class DocumentIntelligenceService : IDocumentIntelligenceService
{
    private readonly DocumentIntelligenceClient _client;
    private readonly ILogger<DocumentIntelligenceService> _logger;

    public const double ConfidenceThreshold = 0.80;

    public DocumentIntelligenceService(
        DocumentIntelligenceClient client,
        ILogger<DocumentIntelligenceService> logger)
    {
        _client = client;
        _logger = logger;
    }

    public async Task<ReceiptExtractionResult> ExtractReceiptDataAsync(Stream receiptStream)
    {
        try
        {
            _logger.LogInformation("Calling Document Intelligence...");

            BinaryData bytesSource = BinaryData.FromStream(receiptStream);

            var operation = await _client.AnalyzeDocumentAsync(
                WaitUntil.Completed,
                "prebuilt-receipt",
                bytesSource);

            var analyzeResult = operation.Value;

            if (analyzeResult.Documents == null || analyzeResult.Documents.Count == 0)
            {
                _logger.LogWarning("Document Intelligence found no receipt in the image.");
                return new ReceiptExtractionResult
                {
                    Success = false,
                    ErrorMessage = "Document Intelligence could not identify a receipt in the uploaded image."
                };
            }

            var document = analyzeResult.Documents[0];
            var result = new ReceiptExtractionResult { Success = true };
            bool needsReview = false;

            if (document.Fields.TryGetValue("MerchantName", out var merchantField)
                && merchantField.FieldType == DocumentFieldType.String)
            {
                result.MerchantName = merchantField.ValueString;
                result.MerchantNameConfidence = merchantField.Confidence ?? 0;

                if (result.MerchantNameConfidence < ConfidenceThreshold)
                {
                    needsReview = true;
                    _logger.LogInformation(
                        "MerchantName confidence {Confidence:F2} is below threshold {Threshold}",
                        result.MerchantNameConfidence, ConfidenceThreshold);
                }
            }
            else
            {
                needsReview = true;
                _logger.LogInformation("MerchantName field not found in Document Intelligence response.");
            }

            if (document.Fields.TryGetValue("Total", out var totalField)
                && totalField.FieldType == DocumentFieldType.Currency)
            {
                result.TotalAmount = (decimal)totalField.ValueCurrency.Amount;
                result.Currency = totalField.ValueCurrency.CurrencyCode
                               ?? totalField.ValueCurrency.CurrencySymbol;
                result.TotalAmountConfidence = totalField.Confidence ?? 0;

                if (result.TotalAmountConfidence < ConfidenceThreshold)
                {
                    needsReview = true;
                    _logger.LogInformation(
                        "Total confidence {Confidence:F2} is below threshold {Threshold}",
                        result.TotalAmountConfidence, ConfidenceThreshold);
                }
            }
            else
            {
                needsReview = true;
                _logger.LogInformation("Total field not found in Document Intelligence response.");
            }

            if (document.Fields.TryGetValue("TransactionDate", out var dateField)
                && dateField.FieldType == DocumentFieldType.Date)
            {
                result.TransactionDate = dateField.ValueDate?.Date;
                result.TransactionDateConfidence = dateField.Confidence ?? 0;

                if (result.TransactionDateConfidence < ConfidenceThreshold)
                {
                    needsReview = true;
                    _logger.LogInformation(
                        "TransactionDate confidence {Confidence:F2} is below threshold {Threshold}",
                        result.TransactionDateConfidence, ConfidenceThreshold);
                }
            }
            else
            {
                needsReview = true;
                _logger.LogInformation("TransactionDate field not found in Document Intelligence response.");
            }

            result.NeedsReview = needsReview;

            _logger.LogInformation(
                "Extraction complete. Merchant: '{Merchant}', Total: {Total} {Currency}, NeedsReview: {NeedsReview}",
                result.MerchantName, result.TotalAmount, result.Currency, result.NeedsReview);

            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Document Intelligence call failed.");
            return new ReceiptExtractionResult
            {
                Success = false,
                ErrorMessage = $"Document Intelligence error: {ex.Message}"
            };
        }
    }
}
using FluentAssertions;
using Microsoft.Extensions.Logging.Abstractions;
using Moq;
using ReceiptTracker.Core.Entities;
using ReceiptTracker.Core.Enums;
using ReceiptTracker.Core.Interfaces;
using ReceiptTracker.Core.Models;
using ReceiptTracker.Functions;

namespace ReceiptTracker.UnitTests.Functions;

public class ReceiptProcessorFunctionTests
{
    private readonly Mock<IReceiptRepository> _mockRepository;
    private readonly Mock<IDocumentIntelligenceService> _mockDocumentService;
    private readonly Mock<IBlobStorageService> _mockBlobService;
    private readonly ReceiptProcessorFunction _function;

    public ReceiptProcessorFunctionTests()
    {
        _mockRepository = new Mock<IReceiptRepository>();
        _mockDocumentService = new Mock<IDocumentIntelligenceService>();
        _mockBlobService = new Mock<IBlobStorageService>();

        _function = new ReceiptProcessorFunction(
            _mockRepository.Object,
            _mockDocumentService.Object,
            _mockBlobService.Object,
            NullLogger<ReceiptProcessorFunction>.Instance
        );

        _mockBlobService
            .Setup(b => b.MoveBlobToProcessedAsync(It.IsAny<string>()))
            .Returns(Task.CompletedTask);
    }

    [Fact]
    public async Task Run_HighConfidenceExtraction_SetsStatusCompleted()
    {
        var (receiptId, blobName, receipt) = SetupReceipt("test-user");

        _mockDocumentService
            .Setup(d => d.ExtractReceiptDataAsync(It.IsAny<Stream>()))
            .ReturnsAsync(new ReceiptExtractionResult
            {
                Success = true,
                MerchantName = "Konzum d.d.",
                MerchantNameConfidence = 0.95,
                TotalAmount = 12.50m,
                TotalAmountConfidence = 0.97,
                Currency = "KM",
                TransactionDate = new DateTime(2025, 6, 15),
                TransactionDateConfidence = 0.92,
                NeedsReview = false
            });

        await _function.Run(new MemoryStream(), blobName);

        _mockRepository.Verify(r => r.UpdateAsync(It.Is<Receipt>(x =>
            x.Status == ReceiptStatus.Completed &&
            x.MerchantName == "Konzum d.d." &&
            x.TotalAmount == 12.50m &&
            x.Currency == "KM" &&
            x.ProcessedAt.HasValue
        )), Times.AtLeastOnce);

        _mockBlobService.Verify(b => b.MoveBlobToProcessedAsync(blobName), Times.Once);
    }

    [Fact]
    public async Task Run_LowConfidenceExtraction_SetsStatusNeedsReview()
    {
        var (_, blobName, _) = SetupReceipt("test-user");

        _mockDocumentService
            .Setup(d => d.ExtractReceiptDataAsync(It.IsAny<Stream>()))
            .ReturnsAsync(new ReceiptExtractionResult
            {
                Success = true,
                MerchantName = "Trg?ovina",
                MerchantNameConfidence = 0.45,
                TotalAmount = 8.70m,
                TotalAmountConfidence = 0.90,
                NeedsReview = true
            });

        await _function.Run(new MemoryStream(), blobName);

        _mockRepository.Verify(r => r.UpdateAsync(It.Is<Receipt>(x =>
            x.Status == ReceiptStatus.NeedsReview
        )), Times.AtLeastOnce);

        _mockBlobService.Verify(b => b.MoveBlobToProcessedAsync(blobName), Times.Once);
    }

    [Fact]
    public async Task Run_ExtractionFails_SetsStatusFailed()
    {
        var (_, blobName, _) = SetupReceipt("test-user");

        _mockDocumentService
            .Setup(d => d.ExtractReceiptDataAsync(It.IsAny<Stream>()))
            .ReturnsAsync(new ReceiptExtractionResult
            {
                Success = false,
                ErrorMessage = "Document Intelligence could not identify a receipt in the uploaded image."
            });

        await _function.Run(new MemoryStream(), blobName);

        _mockRepository.Verify(r => r.UpdateAsync(It.Is<Receipt>(x =>
            x.Status == ReceiptStatus.Failed &&
            x.ErrorMessage != null
        )), Times.AtLeastOnce);

        _mockBlobService.Verify(b => b.MoveBlobToProcessedAsync(It.IsAny<string>()), Times.Never);
    }

    [Fact]
    public async Task Run_BeforeExtraction_SetsStatusProcessing()
    {
        var (_, blobName, _) = SetupReceipt("test-user");
        var processingStatusSet = false;

        _mockRepository
            .Setup(r => r.UpdateAsync(It.Is<Receipt>(x => x.Status == ReceiptStatus.Processing)))
            .Callback<Receipt>(_ => processingStatusSet = true)
            .ReturnsAsync((Receipt r) => r);

        _mockDocumentService
            .Setup(d => d.ExtractReceiptDataAsync(It.IsAny<Stream>()))
            .ReturnsAsync(new ReceiptExtractionResult { Success = true, NeedsReview = false });

        await _function.Run(new MemoryStream(), blobName);

        processingStatusSet.Should().BeTrue("the receipt must be marked Processing before the AI call");
    }

    [Fact]
    public async Task Run_InvalidBlobNameFormat_DoesNothing()
    {
        await _function.Run(new MemoryStream(), "invalid-no-separator.jpg");

        _mockRepository.Verify(r => r.GetByIdAsync(It.IsAny<Guid>(), It.IsAny<string>()), Times.Never);
        _mockDocumentService.Verify(d => d.ExtractReceiptDataAsync(It.IsAny<Stream>()), Times.Never);
    }

    [Fact]
    public async Task Run_BlobNameWithNonGuidFilename_DoesNothing()
    {
        await _function.Run(new MemoryStream(), "test-user/not-a-guid.jpg");

        _mockDocumentService.Verify(d => d.ExtractReceiptDataAsync(It.IsAny<Stream>()), Times.Never);
    }

    [Fact]
    public async Task Run_ReceiptNotFoundInDatabase_DoesNothing()
    {
        var receiptId = Guid.NewGuid();
        var blobName = $"test-user/{receiptId}.jpg";

        _mockRepository
            .Setup(r => r.GetByIdAsync(receiptId, "test-user"))
            .ReturnsAsync((Receipt?)null);

        await _function.Run(new MemoryStream(), blobName);

        _mockDocumentService.Verify(d => d.ExtractReceiptDataAsync(It.IsAny<Stream>()), Times.Never);
    }

    [Fact]
    public async Task Run_BlobMoveFails_ReceiptStillCompleted()
    {
        var (_, blobName, _) = SetupReceipt("test-user");

        _mockDocumentService
            .Setup(d => d.ExtractReceiptDataAsync(It.IsAny<Stream>()))
            .ReturnsAsync(new ReceiptExtractionResult { Success = true, NeedsReview = false });

        _mockBlobService
            .Setup(b => b.MoveBlobToProcessedAsync(It.IsAny<string>()))
            .ThrowsAsync(new Exception("Storage service unavailable"));

        var act = async () => await _function.Run(new MemoryStream(), blobName);
        await act.Should().NotThrowAsync("blob move failure must not propagate to the caller");

        _mockRepository.Verify(r => r.UpdateAsync(It.Is<Receipt>(x =>
            x.Status == ReceiptStatus.Completed
        )), Times.AtLeastOnce);
    }

    private (Guid receiptId, string blobName, Receipt receipt) SetupReceipt(string userId)
    {
        var receiptId = Guid.NewGuid();
        var blobName = $"{userId}/{receiptId}.jpg";
        var receipt = new Receipt
        {
            Id = receiptId,
            UserId = userId,
            BlobName = blobName,
            Status = ReceiptStatus.Uploaded,
            OriginalFileName = "receipt.jpg",
            CreatedAt = DateTime.UtcNow
        };

        _mockRepository
            .Setup(r => r.GetByIdAsync(receiptId, userId))
            .ReturnsAsync(receipt);

        _mockRepository
            .Setup(r => r.UpdateAsync(It.IsAny<Receipt>()))
            .ReturnsAsync((Receipt r) => r);

        return (receiptId, blobName, receipt);
    }
}
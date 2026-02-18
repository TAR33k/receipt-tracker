using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging.Abstractions;
using Moq;
using ReceiptTracker.Api.Controllers;
using ReceiptTracker.Api.DTOs;
using ReceiptTracker.Core.Entities;
using ReceiptTracker.Core.Enums;
using ReceiptTracker.Core.Interfaces;

namespace ReceiptTracker.UnitTests.Controllers;

public class ReceiptsControllerTests
{
    private readonly Mock<IReceiptRepository> _mockRepository;
    private readonly Mock<IBlobStorageService> _mockBlobService;
    private readonly ReceiptsController _controller;

    public ReceiptsControllerTests()
    {
        _mockRepository = new Mock<IReceiptRepository>();
        _mockBlobService = new Mock<IBlobStorageService>();

        _controller = new ReceiptsController(
            _mockRepository.Object,
            _mockBlobService.Object,
            NullLogger<ReceiptsController>.Instance
        );

        SetUserId("test-user");
    }

    [Fact]
    public async Task GetAll_ReturnsOk_WithMappedDtos()
    {
        var receipts = new List<Receipt>
        {
            BuildReceipt("test-user", ReceiptStatus.Uploaded),
            BuildReceipt("test-user", ReceiptStatus.Completed)
        };

        _mockRepository
            .Setup(r => r.GetAllByUserAsync("test-user"))
            .ReturnsAsync(receipts);

        var result = await _controller.GetAll();

        var ok = result.Should().BeOfType<OkObjectResult>().Subject;
        var dtos = ok.Value.Should().BeAssignableTo<IEnumerable<ReceiptDto>>().Subject;
        dtos.Should().HaveCount(2);
    }

    [Fact]
    public async Task GetById_ExistingReceipt_ReturnsOkWithDto()
    {
        var receipt = BuildReceipt("test-user", ReceiptStatus.Completed);
        receipt.MerchantName = "Konzum";

        _mockRepository
            .Setup(r => r.GetByIdAsync(receipt.Id, "test-user"))
            .ReturnsAsync(receipt);

        var result = await _controller.GetById(receipt.Id);

        var ok = result.Should().BeOfType<OkObjectResult>().Subject;
        var dto = ok.Value.Should().BeOfType<ReceiptDto>().Subject;
        dto.Id.Should().Be(receipt.Id);
        dto.MerchantName.Should().Be("Konzum");
        dto.Status.Should().Be("Completed");
    }

    [Fact]
    public async Task GetById_NonExistentReceipt_ReturnsNotFound()
    {
        _mockRepository
            .Setup(r => r.GetByIdAsync(It.IsAny<Guid>(), "test-user"))
            .ReturnsAsync((Receipt?)null);

        var result = await _controller.GetById(Guid.NewGuid());

        result.Should().BeOfType<NotFoundResult>();
    }

    [Fact]
    public async Task SubmitReview_NeedsReviewReceipt_UpdatesFieldsAndSetsCompleted()
    {
        var receipt = BuildReceipt("test-user", ReceiptStatus.NeedsReview);
        receipt.TotalAmount = 9.99m;
        receipt.MerchantNameConfidence = 0.45;

        _mockRepository
            .Setup(r => r.GetByIdAsync(receipt.Id, "test-user"))
            .ReturnsAsync(receipt);

        _mockRepository
            .Setup(r => r.UpdateAsync(It.IsAny<Receipt>()))
            .ReturnsAsync((Receipt r) => r);

        var review = new ReceiptReviewDto(
            MerchantName: "Konzum d.d.",
            TotalAmount: null,
            TransactionDate: null,
            Currency: "BAM",
            TaxId: null,
            FiscalReceiptNumber: null
        );

        var result = await _controller.SubmitReview(receipt.Id, review);

        var ok = result.Should().BeOfType<OkObjectResult>().Subject;
        var dto = ok.Value.Should().BeOfType<ReceiptDto>().Subject;

        dto.Status.Should().Be("Completed");
        dto.MerchantName.Should().Be("Konzum d.d.", "the correction should be applied");
        dto.TotalAmount.Should().Be(9.99m, "unchanged fields should retain their original value");
        dto.Currency.Should().Be("BAM");

        _mockRepository.Verify(r => r.UpdateAsync(It.Is<Receipt>(
            x => x.Status == ReceiptStatus.Completed)), Times.Once);
    }

    [Fact]
    public async Task SubmitReview_UploadedReceipt_ReturnsBadRequest()
    {
        var receipt = BuildReceipt("test-user", ReceiptStatus.Uploaded);

        _mockRepository
            .Setup(r => r.GetByIdAsync(receipt.Id, "test-user"))
            .ReturnsAsync(receipt);

        var result = await _controller.SubmitReview(receipt.Id, new ReceiptReviewDto(
            null, null, null, null, null, null));

        result.Should().BeOfType<BadRequestObjectResult>();
    }

    [Fact]
    public async Task SubmitReview_NonExistentReceipt_ReturnsNotFound()
    {
        _mockRepository
            .Setup(r => r.GetByIdAsync(It.IsAny<Guid>(), "test-user"))
            .ReturnsAsync((Receipt?)null);

        var result = await _controller.SubmitReview(Guid.NewGuid(), new ReceiptReviewDto(
            null, null, null, null, null, null));

        result.Should().BeOfType<NotFoundResult>();
    }

    private void SetUserId(string userId)
    {
        var httpContext = new DefaultHttpContext();
        httpContext.Request.Headers["X-User-Id"] = userId;
        _controller.ControllerContext = new ControllerContext
        {
            HttpContext = httpContext
        };
    }

    private static Receipt BuildReceipt(string userId, ReceiptStatus status) => new()
    {
        Id = Guid.NewGuid(),
        UserId = userId,
        OriginalFileName = "receipt.jpg",
        BlobName = $"{userId}/{Guid.NewGuid()}.jpg",
        Status = status,
        CreatedAt = DateTime.UtcNow
    };
}
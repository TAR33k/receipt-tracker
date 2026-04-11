using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
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
    public async Task GetAll_ReturnsOk_WithPagedResponse()
    {
        var receipts = new List<Receipt>
        {
            BuildReceipt("test-user", ReceiptStatus.Uploaded),
            BuildReceipt("test-user", ReceiptStatus.Completed)
        };

        _mockRepository
            .Setup(r => r.GetPagedAsync("test-user", null, null, null, null, null, null, null, null, 1, 20, default))
            .ReturnsAsync(receipts);

        _mockRepository
            .Setup(r => r.GetCountAsync("test-user", null, null, null, null, null, null, default))
            .ReturnsAsync(2);

        var result = await _controller.GetAll(new ReceiptListRequestDto(), default);

        var ok = result.Should().BeOfType<OkObjectResult>().Subject;
        var response = ok.Value.Should().BeAssignableTo<PagedReceiptsResponseDto>().Subject;
        response.Data.Should().HaveCount(2);
        response.Pagination.TotalCount.Should().Be(2);
        response.Pagination.Page.Should().Be(1);
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
    public async Task GetAll_WithSearch_ReturnsFilteredResults()
    {
        var allReceipts = new List<Receipt>
        {
            new Receipt { Id = Guid.NewGuid(), UserId = "test-user", Status = ReceiptStatus.Completed, MerchantName = "Konzum", OriginalFileName = "r1.jpg", BlobName = "u/r1.jpg", CreatedAt = DateTime.UtcNow },
            new Receipt { Id = Guid.NewGuid(), UserId = "test-user", Status = ReceiptStatus.Completed, MerchantName = "Bingo", OriginalFileName = "r2.jpg", BlobName = "u/r2.jpg", CreatedAt = DateTime.UtcNow },
            new Receipt { Id = Guid.NewGuid(), UserId = "test-user", Status = ReceiptStatus.Completed, MerchantName = "Konzum d.d.", OriginalFileName = "r3.jpg", BlobName = "u/r3.jpg", CreatedAt = DateTime.UtcNow }
        };

        var filteredReceipts = allReceipts.Where(r => r.MerchantName!.ToLower().Contains("konzum")).ToList();

        _mockRepository
            .Setup(r => r.GetPagedAsync("test-user", "konzum", null, null, null, null, null, null, null, 1, 20, default))
            .ReturnsAsync(filteredReceipts);

        _mockRepository
            .Setup(r => r.GetCountAsync("test-user", "konzum", null, null, null, null, null, default))
            .ReturnsAsync(2);

        var result = await _controller.GetAll(new ReceiptListRequestDto(Search: "konzum"), default);

        var ok = result.Should().BeOfType<OkObjectResult>().Subject;
        var response = ok.Value.Should().BeAssignableTo<PagedReceiptsResponseDto>().Subject;
        response.Data.Should().HaveCount(2);
        response.Data.Should().OnlyContain(r => r.MerchantName!.ToLower().Contains("konzum"));
        response.Pagination.TotalCount.Should().Be(2);
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
            Currency: "BAM"
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
            null, null, null, null));

        result.Should().BeOfType<BadRequestObjectResult>();
    }

    [Fact]
    public async Task SubmitReview_NonExistentReceipt_ReturnsNotFound()
    {
        _mockRepository
            .Setup(r => r.GetByIdAsync(It.IsAny<Guid>(), "test-user"))
            .ReturnsAsync((Receipt?)null);

        var result = await _controller.SubmitReview(Guid.NewGuid(), new ReceiptReviewDto(
            null, null, null, null));

        result.Should().BeOfType<NotFoundResult>();
    }

    private void SetUserId(string userId)
    {
        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, userId),
        };
        var identity = new ClaimsIdentity(claims, authenticationType: "TestAuth");
        var principal = new ClaimsPrincipal(identity);

        var httpContext = new DefaultHttpContext
        {
            User = principal
        };

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

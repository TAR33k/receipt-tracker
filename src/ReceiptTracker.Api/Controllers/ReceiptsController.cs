using Microsoft.AspNetCore.Mvc;
using ReceiptTracker.Api.DTOs;
using ReceiptTracker.Core.Entities;
using ReceiptTracker.Core.Enums;
using ReceiptTracker.Core.Helpers;
using ReceiptTracker.Core.Interfaces;

namespace ReceiptTracker.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class ReceiptsController : ControllerBase
{
    private readonly IReceiptRepository _receiptRepository;
    private readonly IBlobStorageService _blobStorageService;
    private readonly ILogger<ReceiptsController> _logger;

    public ReceiptsController(
        IReceiptRepository receiptRepository,
        IBlobStorageService blobStorageService,
        ILogger<ReceiptsController> logger)
    {
        _receiptRepository = receiptRepository;
        _blobStorageService = blobStorageService;
        _logger = logger;
    }

    /// <summary>
    /// Upload a receipt image, returns a receipt ID
    /// Poll GET /api/receipts/{id} to track processing progress
    /// </summary>
    [HttpPost("upload")]
    [ProducesResponseType(typeof(ReceiptUploadResponseDto), StatusCodes.Status202Accepted)]
    [ProducesResponseType(typeof(object), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Upload(IFormFile file)
    {
        var userId = GetUserId();

        if (file.Length == 0)
            return BadRequest(new { error = "File is empty." });

        if (file.Length > FileValidator.MaxFileSizeBytes)
            return BadRequest(new { error = "File exceeds the 10 MB size limit." });

        if (!FileValidator.IsContentTypeAllowed(file.ContentType))
            return BadRequest(new { error = "Only JPEG, PNG, and PDF files are accepted." });

        using var ms = new MemoryStream();
        await file.CopyToAsync(ms);

        // Validate actual file content - magic bytes
        if (!FileValidator.HasValidMagicBytes(ms, file.ContentType))
            return BadRequest(new { error = "File content does not match its declared type." });

        var receiptId = Guid.NewGuid();
        var extension = FileValidator.GetExtension(file.ContentType);
        var blobName = $"{userId}/{receiptId}{extension}";

        ms.Position = 0;
        await _blobStorageService.UploadToQuarantineAsync(ms, blobName, file.ContentType);

        var receipt = await _receiptRepository.CreateAsync(new Receipt
        {
            Id = receiptId,
            UserId = userId,
            OriginalFileName = file.FileName,
            BlobName = blobName,
            Status = ReceiptStatus.Uploaded
        });

        _logger.LogInformation(
            "Receipt {ReceiptId} uploaded. User: {UserId}. Blob: {BlobName}",
            receipt.Id, userId, blobName);

        return Accepted(new ReceiptUploadResponseDto(
            receipt.Id,
            receipt.Status.ToString(),
            "Receipt uploaded successfully."
        ));
    }

    /// <summary>
    /// Returns all receipts for the requesting user, newest first.
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<ReceiptDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll()
    {
        var userId = GetUserId();
        var receipts = await _receiptRepository.GetAllByUserAsync(userId);
        return Ok(receipts.Select(MapToDto));
    }

    /// <summary>
    /// Returns a single receipt. Used for polling
    /// </summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(ReceiptDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id)
    {
        var userId = GetUserId();
        var receipt = await _receiptRepository.GetByIdAsync(id, userId);

        if (receipt is null) return NotFound();

        return Ok(MapToDto(receipt));
    }

    /// <summary>
    /// Submit user corrections for a receipt with Status NeedsReview and sets the receipt status to Completed
    /// </summary>
    [HttpPatch("{id:guid}/review")]
    [ProducesResponseType(typeof(ReceiptDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(object), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> SubmitReview(Guid id, [FromBody] ReceiptReviewDto review)
    {
        var userId = GetUserId();
        var receipt = await _receiptRepository.GetByIdAsync(id, userId);

        if (receipt is null) return NotFound();

        if (receipt.Status != ReceiptStatus.NeedsReview)
            return BadRequest(new { error = $"Only receipts with status 'NeedsReview' can be reviewed. Current status: {receipt.Status}" });

        if (review.MerchantName is not null) receipt.MerchantName = review.MerchantName;
        if (review.TotalAmount.HasValue) receipt.TotalAmount = review.TotalAmount;
        if (review.TransactionDate.HasValue) receipt.TransactionDate = review.TransactionDate;
        if (review.Currency is not null) receipt.Currency = review.Currency;

        receipt.Status = ReceiptStatus.Completed;
        receipt.ProcessedAt = DateTime.UtcNow;

        await _receiptRepository.UpdateAsync(receipt);

        _logger.LogInformation("Receipt {ReceiptId} reviewed and completed by user {UserId}", id, userId);

        return Ok(MapToDto(receipt));
    }

    private string GetUserId()
    {
        var userId = Request.Headers["X-User-Id"].FirstOrDefault();
        return string.IsNullOrWhiteSpace(userId) ? "anonymous" : userId;
    }

    private static ReceiptDto MapToDto(Receipt r) => new(
        r.Id,
        r.Status.ToString(),
        r.MerchantName,
        r.TotalAmount,
        r.TransactionDate,
        r.Currency,
        r.MerchantNameConfidence,
        r.TotalAmountConfidence,
        r.TransactionDateConfidence,
        r.CreatedAt,
        r.ProcessedAt,
        r.Status == ReceiptStatus.NeedsReview,
        r.ErrorMessage
    );
}
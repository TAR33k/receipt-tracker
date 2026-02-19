using ReceiptTracker.Core.Enums;

namespace ReceiptTracker.Core.Entities;

public class Receipt
{
    public Guid Id { get; set; }

    // User identifier - currently comes from the X-User-Id request header. Will be replaced by the authenticated user's claim.
    public string UserId { get; set; } = string.Empty;

    public string OriginalFileName { get; set; } = string.Empty;

    // Path within the blob container: "{userId}/{receiptId}{extension}"
    public string BlobName { get; set; } = string.Empty;

    public ReceiptStatus Status { get; set; } = ReceiptStatus.Uploaded;

    // Fields extracted by Document Intelligence
    public string? MerchantName { get; set; }
    public decimal? TotalAmount { get; set; }
    public DateTime? TransactionDate { get; set; }
    public string? Currency { get; set; }

    // AI confidence scores (0.0 – 1.0)
    public double? MerchantNameConfidence { get; set; }
    public double? TotalAmountConfidence { get; set; }
    public double? TransactionDateConfidence { get; set; }

    // Audit fields
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ProcessedAt { get; set; }
    public string? ErrorMessage { get; set; }
}
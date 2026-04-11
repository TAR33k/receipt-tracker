using ReceiptTracker.Core.Enums;
using ReceiptTracker.Core.Models;

namespace ReceiptTracker.Core.Entities;

public class Receipt
{
    public Guid Id { get; set; }

    public string UserId { get; set; } = string.Empty;

    public string OriginalFileName { get; set; } = string.Empty;

    // Path within the blob container: "{userId}/{receiptId}{extension}"
    public string BlobName { get; set; } = string.Empty;

    public ReceiptStatus Status { get; set; } = ReceiptStatus.Uploaded;

    // Fields extracted by Document Intelligence
    public string? MerchantName { get; set; }
    public decimal? TotalAmount { get; set; }
    public DateTime? TransactionDate { get; set; }
    public TimeSpan? TransactionTime { get; set; }
    public string? Currency { get; set; }
    public string? CountryRegion { get; set; }
    public string? ReceiptType { get; set; }
    public decimal? TotalTax { get; set; }
    public string? TotalTaxCurrency { get; set; }
    public List<ReceiptItem> Items { get; set; } = new();
    public MerchantAddress? MerchantAddress { get; set; }
    public List<TaxDetail> TaxDetails { get; set; } = new();

    // AI confidence scores (0.0 – 1.0)
    public double? MerchantNameConfidence { get; set; }
    public double? TotalAmountConfidence { get; set; }
    public double? TransactionDateConfidence { get; set; }
    public double? TransactionTimeConfidence { get; set; }
    public double? CountryRegionConfidence { get; set; }
    public double? ReceiptTypeConfidence { get; set; }
    public double? TotalTaxConfidence { get; set; }

    // Audit fields
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ProcessedAt { get; set; }
    public string? ErrorMessage { get; set; }
}

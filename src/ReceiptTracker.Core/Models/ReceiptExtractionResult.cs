namespace ReceiptTracker.Core.Models;

public class ReceiptExtractionResult
{
    public bool Success { get; set; }
    public string? ErrorMessage { get; set; }
    public string? MerchantName { get; set; }
    public double MerchantNameConfidence { get; set; }
    public decimal? TotalAmount { get; set; }
    public double TotalAmountConfidence { get; set; }
    public string? Currency { get; set; }
    public DateTime? TransactionDate { get; set; }
    public double TransactionDateConfidence { get; set; }
    public TimeSpan? TransactionTime { get; set; }
    public double TransactionTimeConfidence { get; set; }
    public string? CountryRegion { get; set; }
    public double CountryRegionConfidence { get; set; }
    public string? ReceiptType { get; set; }
    public double ReceiptTypeConfidence { get; set; }
    public List<ReceiptItem> Items { get; set; } = new();
    public MerchantAddress? MerchantAddress { get; set; }
    public List<TaxDetail> TaxDetails { get; set; } = new();
    public decimal? TotalTax { get; set; }
    public string? TotalTaxCurrency { get; set; }
    public double TotalTaxConfidence { get; set; }
    public bool NeedsReview { get; set; }
}

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
    public bool NeedsReview { get; set; }
}
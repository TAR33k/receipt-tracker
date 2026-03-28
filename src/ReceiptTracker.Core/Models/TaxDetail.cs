namespace ReceiptTracker.Core.Models;

public class TaxDetail
{
    public string? Content { get; set; }
    public double ContentConfidence { get; set; }
    public decimal? Amount { get; set; }
    public string? AmountCurrency { get; set; }
    public double AmountConfidence { get; set; }
    public string? Description { get; set; }
    public double DescriptionConfidence { get; set; }
    public decimal? NetAmount { get; set; }
    public string? NetAmountCurrency { get; set; }
    public double NetAmountConfidence { get; set; }
    public double? Rate { get; set; }
    public double RateConfidence { get; set; }
}

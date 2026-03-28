namespace ReceiptTracker.Core.Models;

public class ReceiptItem
{
    public string? Content { get; set; }
    public double ContentConfidence { get; set; }
    public string? Description { get; set; }
    public double DescriptionConfidence { get; set; }
    public decimal? Price { get; set; }
    public string? PriceCurrency { get; set; }
    public double PriceConfidence { get; set; }
    public double? Quantity { get; set; }
    public double QuantityConfidence { get; set; }
    public decimal? TotalPrice { get; set; }
    public string? TotalPriceCurrency { get; set; }
    public double TotalPriceConfidence { get; set; }
}

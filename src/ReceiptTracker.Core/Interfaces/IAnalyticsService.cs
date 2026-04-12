using ReceiptTracker.Core.Enums;

namespace ReceiptTracker.Core.Interfaces;

public interface IAnalyticsService
{
    Task<SpendingAnalyticsResult> GetSpendingOverviewAsync(
        string userId,
        string targetCurrency,
        CancellationToken ct = default);

    Task<MonthlyTrendResult[]> GetSpendingTrendsAsync(
        string userId,
        string targetCurrency,
        string granularity = "month",
        int periods = 12,
        CancellationToken ct = default);

    Task<MerchantAnalyticsResult[]> GetMerchantAnalyticsAsync(
        string userId,
        string targetCurrency,
        int top = 10,
        CancellationToken ct = default);

    Task<TaxAnalyticsResult> GetTaxSummaryAsync(
        string userId,
        int year = 0,
        CancellationToken ct = default);

    Task<TimeDistributionResult> GetTimeDistributionAsync(
        string userId,
        CancellationToken ct = default);

    Task<QuickStatsResult> GetQuickStatsAsync(
        string userId,
        string targetCurrency,
        CancellationToken ct = default);

    Task<AnalyticsDashboardResult> GetDashboardAsync(
        string userId,
        string targetCurrency,
        CancellationToken ct = default);
}

public class SpendingAnalyticsResult
{
    public decimal CurrentMonthTotal { get; set; }
    public decimal PreviousMonthTotal { get; set; }
    public decimal PercentChange { get; set; }
    public bool IsIncrease { get; set; }
    public int CurrentMonthReceiptCount { get; set; }
    public int PreviousMonthReceiptCount { get; set; }
    public decimal AverageReceiptAmount { get; set; }
    public decimal YearToDateTotal { get; set; }
}

public class MonthlyTrendResult
{
    public DateTime PeriodStart { get; set; }
    public DateTime PeriodEnd { get; set; }
    public string PeriodLabel { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public int ReceiptCount { get; set; }
    public decimal AverageAmount { get; set; }
    public decimal? ProjectedAmount { get; set; }
}

public class MerchantAnalyticsResult
{
    public string MerchantName { get; set; } = string.Empty;
    public string NormalizedName { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public int ReceiptCount { get; set; }
    public decimal AverageAmount { get; set; }
    public DateTime? FirstPurchase { get; set; }
    public DateTime? LastPurchase { get; set; }
    public List<MonthlyTrendResult> MonthlyTrends { get; set; } = new();
    public string? Category { get; set; }
}

public class TaxRateDistributionResult
{
    public decimal Rate { get; set; }
    public decimal TotalAmount { get; set; }
    public int ReceiptCount { get; set; }
}

public class MonthlyTaxResult
{
    public string Month { get; set; } = string.Empty;
    public decimal TotalTax { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal TaxRate { get; set; }
}

public class TaxAnalyticsResult
{
    public decimal TotalTaxPaid { get; set; }
    public decimal EffectiveTaxRate { get; set; }
    public decimal DeductibleEstimate { get; set; }
    public List<TaxRateDistributionResult> TaxRates { get; set; } = new();
    public List<MonthlyTaxResult> MonthlyBreakdown { get; set; } = new();
}

public class DayOfWeekDistributionResult
{
    public string DayName { get; set; } = string.Empty;
    public int DayOfWeek { get; set; }
    public decimal TotalAmount { get; set; }
    public int ReceiptCount { get; set; }
}

public class HourDistributionResult
{
    public int Hour { get; set; }
    public string TimeLabel { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public int ReceiptCount { get; set; }
}

public class PeakSpendingResult
{
    public string PeakDay { get; set; } = string.Empty;
    public string PeakTime { get; set; } = string.Empty;
    public decimal PeakDayAmount { get; set; }
    public decimal PeakTimeAmount { get; set; }
}

public class TimeDistributionResult
{
    public List<DayOfWeekDistributionResult> ByDayOfWeek { get; set; } = new();
    public List<HourDistributionResult> ByHour { get; set; } = new();
    public PeakSpendingResult PeakSpending { get; set; } = new();
}

public class QuickStatsResult
{
    public int TotalReceipts { get; set; }
    public int ThisMonthReceipts { get; set; }
    public decimal AllTimeTotal { get; set; }
    public int UniqueMerchants { get; set; }
    public double AverageConfidence { get; set; }
    public string MostFrequentMerchant { get; set; } = string.Empty;
    public DateTime? FirstReceiptDate { get; set; }
}

public class AnalyticsDashboardResult
{
    public SpendingAnalyticsResult SpendingOverview { get; set; } = new();
    public List<MonthlyTrendResult> SpendingTrends { get; set; } = new();
    public List<MerchantAnalyticsResult> TopMerchants { get; set; } = new();
    public List<CategoryBreakdownResult> CategoryBreakdown { get; set; } = new();
    public TaxAnalyticsResult TaxSummary { get; set; } = new();
    public TimeDistributionResult TimeDistribution { get; set; } = new();
    public QuickStatsResult QuickStats { get; set; } = new();
    public string Currency { get; set; } = "BAM";
    public DateTime GeneratedAt { get; set; }
}

public class CategoryBreakdownResult
{
    public string Category { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public decimal PercentageOfTotal { get; set; }
    public int ReceiptCount { get; set; }
    public string Color { get; set; } = string.Empty;
}

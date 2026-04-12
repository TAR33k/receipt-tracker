namespace ReceiptTracker.Api.DTOs;

public record SpendingOverviewDto(
    decimal CurrentMonthTotal,
    decimal PreviousMonthTotal,
    decimal PercentChange,
    bool IsIncrease,
    int CurrentMonthReceiptCount,
    int PreviousMonthReceiptCount,
    decimal AverageReceiptAmount,
    decimal YearToDateTotal
);

public record MonthlyTrendDto(
    DateTime PeriodStart,
    DateTime PeriodEnd,
    string PeriodLabel,
    decimal TotalAmount,
    int ReceiptCount,
    decimal AverageAmount,
    decimal? ProjectedAmount
);

public record MerchantSpendingDto(
    string MerchantName,
    string NormalizedName,
    decimal TotalAmount,
    int ReceiptCount,
    decimal AverageAmount,
    DateTime? FirstPurchase,
    DateTime? LastPurchase,
    MonthlyTrendDto[] MonthlyTrends,
    string? Category
);

public record CategoryBreakdownDto(
    string Category,
    decimal TotalAmount,
    decimal PercentageOfTotal,
    int ReceiptCount,
    string Color
);

public record TaxRateDistributionDto(
    decimal Rate,
    decimal TotalAmount,
    int ReceiptCount
);

public record MonthlyTaxDto(
    string Month,
    decimal TotalTax,
    decimal TotalAmount,
    decimal TaxRate
);

public record TaxSummaryDto(
    decimal TotalTaxPaid,
    decimal EffectiveTaxRate,
    decimal DeductibleEstimate,
    TaxRateDistributionDto[] TaxRates,
    MonthlyTaxDto[] MonthlyBreakdown
);

public record DayOfWeekDistributionDto(
    string DayName,
    int DayOfWeek,
    decimal TotalAmount,
    int ReceiptCount
);

public record HourDistributionDto(
    int Hour,
    string TimeLabel,
    decimal TotalAmount,
    int ReceiptCount
);

public record PeakSpendingDto(
    string PeakDay,
    string PeakTime,
    decimal PeakDayAmount,
    decimal PeakTimeAmount
);

public record TimeDistributionDto(
    DayOfWeekDistributionDto[] ByDayOfWeek,
    HourDistributionDto[] ByHour,
    PeakSpendingDto PeakSpending
);

public record QuickStatsDto(
    int TotalReceipts,
    int ThisMonthReceipts,
    decimal AllTimeTotal,
    int UniqueMerchants,
    double AverageConfidence,
    string MostFrequentMerchant,
    DateTime? FirstReceiptDate
);

public record AnalyticsDashboardDto(
    SpendingOverviewDto SpendingOverview,
    MonthlyTrendDto[] SpendingTrends,
    MerchantSpendingDto[] TopMerchants,
    CategoryBreakdownDto[] CategoryBreakdown,
    TaxSummaryDto TaxSummary,
    TimeDistributionDto TimeDistribution,
    QuickStatsDto QuickStats,
    string Currency,
    DateTime GeneratedAt
);

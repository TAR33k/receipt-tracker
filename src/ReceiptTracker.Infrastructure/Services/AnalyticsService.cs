using System.Globalization;
using System.Text.RegularExpressions;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using ReceiptTracker.Core.Enums;
using ReceiptTracker.Core.Interfaces;

namespace ReceiptTracker.Infrastructure.Services;

public class AnalyticsService : IAnalyticsService
{
    private readonly IReceiptRepository _receiptRepository;
    private readonly ICurrencyConverter _currencyConverter;
    private readonly IMemoryCache _cache;
    private readonly ILogger<AnalyticsService> _logger;

    private static readonly string[] CategoryColors =
    [
        "#5E6AD2", "#6366F1", "#818CF8", "#A5B4FC", "#C7D2FE",
        "#10B981", "#34D399", "#6EE7B7", "#059669", "#047857"
    ];

    public AnalyticsService(
        IReceiptRepository receiptRepository,
        ICurrencyConverter currencyConverter,
        IMemoryCache cache,
        ILogger<AnalyticsService> logger)
    {
        _receiptRepository = receiptRepository;
        _currencyConverter = currencyConverter;
        _cache = cache;
        _logger = logger;
    }

    public async Task<AnalyticsDashboardResult> GetDashboardAsync(
        string userId,
        string targetCurrency,
        CancellationToken ct = default)
    {
        var cacheKey = $"analytics:dashboard:{userId}:{targetCurrency}:{DateTime.UtcNow:yyyyMMdd}";

        if (_cache.TryGetValue(cacheKey, out AnalyticsDashboardResult? cached) && cached != null)
        {
            return cached;
        }

        var receipts = await _receiptRepository.GetForAnalyticsAsync(
            userId,
            status: ReceiptStatus.Completed,
            ct: ct);

        await PrefetchExchangeRates(receipts, targetCurrency);

        var convertedReceipts = receipts
            .Select(r => new ConvertedReceipt(r, ConvertAmount(r.TotalAmount ?? 0, r.Currency, targetCurrency)))
            .ToList();

        var spendingOverview = CalculateSpendingOverview(convertedReceipts);
        var spendingTrends = CalculateSpendingTrends(convertedReceipts, "month", 12);
        var topMerchants = CalculateMerchantAnalytics(convertedReceipts, 5);
        var categoryBreakdown = CalculateCategoryBreakdown(convertedReceipts);
        var timeDistribution = CalculateTimeDistribution(convertedReceipts);
        var quickStats = CalculateQuickStats(convertedReceipts);
        var taxSummary = CalculateTaxSummary(convertedReceipts);

        var result = new AnalyticsDashboardResult
        {
            SpendingOverview = spendingOverview,
            SpendingTrends = spendingTrends,
            TopMerchants = topMerchants,
            CategoryBreakdown = categoryBreakdown,
            TaxSummary = taxSummary,
            TimeDistribution = timeDistribution,
            QuickStats = quickStats,
            Currency = targetCurrency,
            GeneratedAt = DateTime.UtcNow
        };

        _cache.Set(cacheKey, result, TimeSpan.FromMinutes(15));

        return result;
    }

    public async Task<SpendingAnalyticsResult> GetSpendingOverviewAsync(
        string userId,
        string targetCurrency,
        CancellationToken ct = default)
    {
        var receipts = await _receiptRepository.GetForAnalyticsAsync(
            userId,
            status: ReceiptStatus.Completed,
            ct: ct);

        await PrefetchExchangeRates(receipts, targetCurrency);

        var convertedReceipts = receipts
            .Select(r => new ConvertedReceipt(r, ConvertAmount(r.TotalAmount ?? 0, r.Currency, targetCurrency)))
            .ToList();

        return CalculateSpendingOverview(convertedReceipts);
    }

    public async Task<MonthlyTrendResult[]> GetSpendingTrendsAsync(
        string userId,
        string targetCurrency,
        string granularity = "month",
        int periods = 12,
        CancellationToken ct = default)
    {
        var receipts = await _receiptRepository.GetForAnalyticsAsync(
            userId,
            status: ReceiptStatus.Completed,
            ct: ct);

        await PrefetchExchangeRates(receipts, targetCurrency);

        var convertedReceipts = receipts
            .Select(r => new ConvertedReceipt(r, ConvertAmount(r.TotalAmount ?? 0, r.Currency, targetCurrency)))
            .ToList();

        return CalculateSpendingTrends(convertedReceipts, granularity, periods).ToArray();
    }

    public async Task<MerchantAnalyticsResult[]> GetMerchantAnalyticsAsync(
        string userId,
        string targetCurrency,
        int top = 10,
        CancellationToken ct = default)
    {
        var receipts = await _receiptRepository.GetForAnalyticsAsync(
            userId,
            status: ReceiptStatus.Completed,
            ct: ct);

        await PrefetchExchangeRates(receipts, targetCurrency);

        var convertedReceipts = receipts
            .Select(r => new ConvertedReceipt(r, ConvertAmount(r.TotalAmount ?? 0, r.Currency, targetCurrency)))
            .ToList();

        return CalculateMerchantAnalytics(convertedReceipts, top).ToArray();
    }

    public async Task<TaxAnalyticsResult> GetTaxSummaryAsync(
        string userId,
        int year = 0,
        CancellationToken ct = default)
    {
        var targetYear = year == 0 ? DateTime.UtcNow.Year : year;

        var receipts = await _receiptRepository.GetForAnalyticsAsync(
            userId,
            from: new DateTime(targetYear, 1, 1),
            to: new DateTime(targetYear, 12, 31),
            status: ReceiptStatus.Completed,
            ct: ct);

        var convertedReceipts = receipts
            .Select(r => new ConvertedReceipt(r, r.TotalAmount ?? 0))
            .ToList();

        return CalculateTaxSummary(convertedReceipts);
    }

    public async Task<TimeDistributionResult> GetTimeDistributionAsync(
        string userId,
        CancellationToken ct = default)
    {
        var receipts = await _receiptRepository.GetForAnalyticsAsync(
            userId,
            status: ReceiptStatus.Completed,
            ct: ct);

        var convertedReceipts = receipts
            .Select(r => new ConvertedReceipt(r, r.TotalAmount ?? 0))
            .ToList();

        return CalculateTimeDistribution(convertedReceipts);
    }

    public async Task<QuickStatsResult> GetQuickStatsAsync(
        string userId,
        string targetCurrency,
        CancellationToken ct = default)
    {
        var receipts = await _receiptRepository.GetForAnalyticsAsync(
            userId,
            status: ReceiptStatus.Completed,
            ct: ct);

        await PrefetchExchangeRates(receipts, targetCurrency);

        var convertedReceipts = receipts
            .Select(r => new ConvertedReceipt(r, ConvertAmount(r.TotalAmount ?? 0, r.Currency, targetCurrency)))
            .ToList();

        return CalculateQuickStats(convertedReceipts);
    }

    private decimal ConvertAmount(decimal amount, string? fromCurrency, string toCurrency)
    {
        if (string.IsNullOrEmpty(fromCurrency) || fromCurrency.Equals(toCurrency, StringComparison.OrdinalIgnoreCase))
            return amount;

        return _currencyConverter.Convert(amount, fromCurrency, toCurrency);
    }

    private static SpendingAnalyticsResult CalculateSpendingOverview(List<ConvertedReceipt> receipts)
    {
        var now = DateTime.UtcNow;
        var currentMonth = now.Month;
        var currentYear = now.Year;
        var lastMonth = currentMonth == 1 ? 12 : currentMonth - 1;
        var lastMonthYear = currentMonth == 1 ? currentYear - 1 : currentYear;

        var currentMonthReceipts = receipts
            .Where(r => r.TransactionDate?.Month == currentMonth && r.TransactionDate?.Year == currentYear)
            .ToList();

        var lastMonthReceipts = receipts
            .Where(r => r.TransactionDate?.Month == lastMonth && r.TransactionDate?.Year == lastMonthYear)
            .ToList();

        var currentMonthTotal = currentMonthReceipts.Sum(r => r.ConvertedAmount);
        var lastMonthTotal = lastMonthReceipts.Sum(r => r.ConvertedAmount);

        var percentChange = lastMonthTotal > 0
            ? ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100
            : 0;

        var yearToDate = receipts
            .Where(r => r.TransactionDate?.Year == currentYear)
            .Sum(r => r.ConvertedAmount);

        var allTimeTotal = receipts.Sum(r => r.ConvertedAmount);
        var averageAmount = receipts.Count > 0 ? allTimeTotal / receipts.Count : 0;

        return new SpendingAnalyticsResult
        {
            CurrentMonthTotal = currentMonthTotal,
            PreviousMonthTotal = lastMonthTotal,
            PercentChange = percentChange,
            IsIncrease = percentChange >= 0,
            CurrentMonthReceiptCount = currentMonthReceipts.Count,
            PreviousMonthReceiptCount = lastMonthReceipts.Count,
            AverageReceiptAmount = averageAmount,
            YearToDateTotal = yearToDate
        };
    }

    private static List<MonthlyTrendResult> CalculateSpendingTrends(
        List<ConvertedReceipt> receipts,
        string granularity,
        int periods)
    {
        var now = DateTime.UtcNow;
        var trends = new List<MonthlyTrendResult>();

        for (int i = periods - 1; i >= 0; i--)
        {
            var periodStart = granularity.ToLower() switch
            {
                "month" => new DateTime(now.Year, now.Month, 1).AddMonths(-i),
                "week" => now.AddDays(-(int)now.DayOfWeek).AddDays(-i * 7),
                "day" => now.Date.AddDays(-i),
                _ => now.AddMonths(-i)
            };

            var periodEnd = granularity.ToLower() switch
            {
                "month" => periodStart.AddMonths(1).AddDays(-1),
                "week" => periodStart.AddDays(6),
                "day" => periodStart,
                _ => periodStart.AddMonths(1).AddDays(-1)
            };

            var periodReceipts = receipts.Where(r =>
                r.TransactionDate >= periodStart &&
                r.TransactionDate <= periodEnd).ToList();

            var total = periodReceipts.Sum(r => r.ConvertedAmount);
            var count = periodReceipts.Count;

            var label = granularity.ToLower() switch
            {
                "month" => periodStart.ToString("MMM yyyy", CultureInfo.InvariantCulture),
                "week" => $"Week {i + 1}",
                "day" => periodStart.ToString("MMM dd", CultureInfo.InvariantCulture),
                _ => periodStart.ToString("MMM yyyy", CultureInfo.InvariantCulture)
            };

            var daysElapsed = Math.Max(1, (int)(now - periodStart).TotalDays);
            var totalDaysInPeriod = (decimal)(periodEnd - periodStart).TotalDays;

            trends.Add(new MonthlyTrendResult
            {
                PeriodStart = periodStart,
                PeriodEnd = periodEnd,
                PeriodLabel = label,
                TotalAmount = total,
                ReceiptCount = count,
                AverageAmount = count > 0 ? total / count : 0,
                ProjectedAmount = periodEnd > now && count > 0
                    ? total * (totalDaysInPeriod / daysElapsed)
                    : null,
            });
        }

        return trends;
    }

    private static List<MerchantAnalyticsResult> CalculateMerchantAnalytics(
        List<ConvertedReceipt> receipts,
        int top)
    {
        var merchantGroups = receipts
            .Where(r => !string.IsNullOrEmpty(r.MerchantName))
            .GroupBy(r => NormalizeMerchantName(r.MerchantName!))
            .Where(g => !string.IsNullOrEmpty(g.Key))
            .Select(g =>
            {
                var sorted = g.OrderBy(r => r.TransactionDate).ToList();
                var mostCommonName = g.GroupBy(r => r.MerchantName)
                    .OrderByDescending(x => x.Count())
                    .First()
                    .Key ?? "Unknown";

                return new MerchantAnalyticsResult
                {
                    MerchantName = FormatMerchantName(mostCommonName),
                    NormalizedName = g.Key,
                    TotalAmount = g.Sum(r => r.ConvertedAmount),
                    ReceiptCount = g.Count(),
                    AverageAmount = g.Average(r => r.ConvertedAmount),
                    FirstPurchase = sorted.First().TransactionDate,
                    LastPurchase = sorted.Last().TransactionDate,
                    MonthlyTrends = CalculateMerchantMonthlyTrends(sorted),
                    Category = MapReceiptTypeToCategory(g.First().ReceiptType)
                };
            })
            .OrderByDescending(m => m.TotalAmount)
            .Take(top)
            .ToList();

        return merchantGroups;
    }

    private static List<MonthlyTrendResult> CalculateMerchantMonthlyTrends(List<ConvertedReceipt> receipts)
    {
        var now = DateTime.UtcNow;
        var trends = new List<MonthlyTrendResult>();

        for (int i = 11; i >= 0; i--)
        {
            var monthStart = new DateTime(now.Year, now.Month, 1).AddMonths(-i);
            var monthEnd = monthStart.AddMonths(1).AddDays(-1);

            var monthReceipts = receipts
                .Where(r => r.TransactionDate >= monthStart && r.TransactionDate <= monthEnd)
                .ToList();

            trends.Add(new MonthlyTrendResult
            {
                PeriodStart = monthStart,
                PeriodEnd = monthEnd,
                PeriodLabel = monthStart.ToString("MMM yyyy", CultureInfo.InvariantCulture),
                TotalAmount = monthReceipts.Sum(r => r.ConvertedAmount),
                ReceiptCount = monthReceipts.Count,
                AverageAmount = monthReceipts.Count > 0
                    ? monthReceipts.Sum(r => r.ConvertedAmount) / monthReceipts.Count
                    : 0
            });
        }

        return trends;
    }

    private static List<CategoryBreakdownResult> CalculateCategoryBreakdown(List<ConvertedReceipt> receipts)
    {
        var categorized = receipts
            .Select(r => new
            {
                Category = MapReceiptTypeToCategory(r.ReceiptType),
                Amount = r.ConvertedAmount
            })
            .GroupBy(x => x.Category)
            .Select((g, index) => new CategoryBreakdownResult
            {
                Category = g.Key,
                TotalAmount = g.Sum(x => x.Amount),
                ReceiptCount = g.Count(),
                Color = CategoryColors[index % CategoryColors.Length]
            })
            .OrderByDescending(c => c.TotalAmount)
            .ToList();

        var total = categorized.Sum(c => c.TotalAmount);
        foreach (var category in categorized)
            category.PercentageOfTotal = total > 0 ? (category.TotalAmount / total) * 100 : 0;

        return categorized;
    }

    private static TaxAnalyticsResult CalculateTaxSummary(List<ConvertedReceipt> receipts)
    {
        var receiptsWithTax = receipts.Where(r => r.TotalTax.HasValue && r.TotalTax.Value > 0).ToList();

        var totalTax = receiptsWithTax.Sum(r => r.TotalTax ?? 0);
        var totalAmount = receipts.Sum(r => r.ConvertedAmount);
        var effectiveRate = totalAmount > 0 ? (totalTax / totalAmount) * 100 : 0;

        var monthlyTax = receipts
            .Where(r => r.TransactionDate.HasValue)
            .GroupBy(r => new { r.TransactionDate!.Value.Year, r.TransactionDate.Value.Month })
            .Select(g => new MonthlyTaxResult
            {
                Month = new DateTime(g.Key.Year, g.Key.Month, 1).ToString("MMM yyyy", CultureInfo.InvariantCulture),
                TotalTax = g.Sum(r => r.TotalTax ?? 0),
                TotalAmount = g.Sum(r => r.ConvertedAmount),
                TaxRate = g.Sum(r => r.ConvertedAmount) > 0
                    ? (g.Sum(r => r.TotalTax ?? 0) / g.Sum(r => r.ConvertedAmount)) * 100
                    : 0
            })
            .OrderBy(m => m.Month)
            .ToList();

        var taxRates = receiptsWithTax
            .GroupBy(r => r.TotalTax)
            .Select(g => new TaxRateDistributionResult
            {
                Rate = g.Key ?? 0,
                TotalAmount = g.Sum(r => r.ConvertedAmount),
                ReceiptCount = g.Count()
            })
            .OrderBy(r => r.Rate)
            .ToList();

        return new TaxAnalyticsResult
        {
            TotalTaxPaid = totalTax,
            EffectiveTaxRate = effectiveRate,
            DeductibleEstimate = totalTax * 0.5m,
            MonthlyBreakdown = monthlyTax,
            TaxRates = taxRates
        };
    }

    private static TimeDistributionResult CalculateTimeDistribution(List<ConvertedReceipt> receipts)
    {
        var dayNames = new[] { "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" };

        var byDayOfWeek = receipts
            .Where(r => r.TransactionDate.HasValue)
            .GroupBy(r => (int)r.TransactionDate!.Value.DayOfWeek)
            .Select(g => new DayOfWeekDistributionResult
            {
                DayName = dayNames[g.Key],
                DayOfWeek = g.Key,
                TotalAmount = g.Sum(r => r.ConvertedAmount),
                ReceiptCount = g.Count()
            })
            .OrderBy(d => d.DayOfWeek)
            .ToList();

        var byHour = receipts
            .Where(r => r.TransactionTime.HasValue)
            .GroupBy(r => r.TransactionTime!.Value.Hours)
            .Select(g => new HourDistributionResult
            {
                Hour = g.Key,
                TimeLabel = $"{g.Key:D2}:00",
                TotalAmount = g.Sum(r => r.ConvertedAmount),
                ReceiptCount = g.Count()
            })
            .OrderBy(h => h.Hour)
            .ToList();

        var peakDay = byDayOfWeek.OrderByDescending(d => d.TotalAmount).FirstOrDefault();
        var peakTime = byHour.OrderByDescending(h => h.TotalAmount).FirstOrDefault();

        return new TimeDistributionResult
        {
            ByDayOfWeek = byDayOfWeek,
            ByHour = byHour,
            PeakSpending = new PeakSpendingResult
            {
                PeakDay = peakDay?.DayName ?? "N/A",
                PeakTime = peakTime != null ? $"{peakTime.Hour:D2}:00" : "N/A",
                PeakDayAmount = peakDay?.TotalAmount ?? 0,
                PeakTimeAmount = peakTime?.TotalAmount ?? 0
            }
        };
    }

    private static QuickStatsResult CalculateQuickStats(List<ConvertedReceipt> receipts)
    {
        var now = DateTime.UtcNow;
        var currentMonth = now.Month;
        var currentYear = now.Year;

        var merchantGroups = receipts
            .Where(r => !string.IsNullOrEmpty(r.MerchantName))
            .GroupBy(r => NormalizeMerchantName(r.MerchantName!))
            .ToList();

        var mostFrequent = merchantGroups
            .OrderByDescending(g => g.Count())
            .FirstOrDefault();

        var allTimeTotal = receipts.Sum(r => r.ConvertedAmount);

        var avgConfidence = receipts.Any()
            ? receipts.Average(r => r.TotalAmountConfidence ?? 0)
            : 0;

        return new QuickStatsResult
        {
            TotalReceipts = receipts.Count,
            ThisMonthReceipts = receipts.Count(r =>
                r.TransactionDate?.Month == currentMonth &&
                r.TransactionDate?.Year == currentYear),
            AllTimeTotal = allTimeTotal,
            UniqueMerchants = merchantGroups.Count,
            AverageConfidence = avgConfidence,
            MostFrequentMerchant = mostFrequent != null
                ? FormatMerchantName(mostFrequent.First().MerchantName!)
                : "N/A",
            FirstReceiptDate = receipts.Any()
                ? receipts.Min(r => r.TransactionDate ?? r.CreatedAt)
                : null
        };
    }

    private static string NormalizeMerchantName(string name)
    {
        if (string.IsNullOrEmpty(name)) return "";

        var normalized = Regex.Replace(name, @"[""'""''']", "");
        normalized = Regex.Replace(normalized, @"[\s\-_]+", " ");
        normalized = normalized.Trim().ToLowerInvariant();

        var suffixPattern =
            @"(?:j[.,]\s*)?(?:d|cl|1|&|ol|c)?[.,]\s*[o0c][.,]\s*[o0c][.,]?" +
            @"|\b(?:doo|d00|jdoo|sro|dno|dd|ad|md|pj|sp|vl)\b" +
            @"|\bd\s*o\s*o\b" +
            @"|\b(?:d[.,]\s*d|a[.,]\s*d|j[.,]\s*d|s[.,]\s*p|p[.,]\s*j|v[.,]\s*l)[.,]?" +
            @"|\bs[.,]\s*r[.,]\s*o[.,]?" +
            @"|\bspol\s*s\s*r[.,]\s*o[.,]?" +
            @"|o\.o\.";

        var match = Regex.Match(normalized, suffixPattern);
        if (match.Success)
        {
            normalized = match.Index == 0
                ? Regex.Replace(normalized, suffixPattern, "")
                : normalized[..match.Index];
        }

        return Regex.Replace(normalized, @"[,\.\-\s]+$", "").Trim();
    }

    private static string FormatMerchantName(string name)
    {
        if (string.IsNullOrEmpty(name)) return "Unknown";

        var acronyms = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
        {
            "d.o.o.", "a.d.", "d.d.", "s.r.o.", "spol.", "s.r.o", "j.d.o.o.",
            "d.n.o.", "o.o.", "p.j.", "pj", "md", "doo", "sp", "s.p."
        };

        var textInfo = CultureInfo.InvariantCulture.TextInfo;
        return string.Join(" ", name.Split(' ').Select(word =>
            acronyms.Contains(word)
                ? word.ToUpperInvariant()
                : textInfo.ToTitleCase(word.ToLowerInvariant())));
    }

    private static string MapReceiptTypeToCategory(string? receiptType) =>
        receiptType?.ToLowerInvariant() switch
        {
            "meal" => "Dining",
            "gas" => "Fuel",
            "parking" => "Parking",
            "hotel" => "Travel",
            "receipt" => "General",
            _ => "Other",
        };

    private async Task PrefetchExchangeRates(
        IEnumerable<ReceiptTracker.Core.Entities.Receipt> receipts,
        string targetCurrency)
    {
        try
        {
            await _currencyConverter.GetExchangeRatesAsync("EUR");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex,
                "Failed to prefetch exchange rates. " +
                "Analytics amounts will be shown in their original currencies.");
        }
    }

    private record ConvertedReceipt(
        ReceiptTracker.Core.Entities.Receipt Receipt,
        decimal ConvertedAmount)
    {
        public DateTime? TransactionDate => Receipt.TransactionDate;
        public TimeSpan? TransactionTime => Receipt.TransactionTime;
        public string? MerchantName => Receipt.MerchantName;
        public string? ReceiptType => Receipt.ReceiptType;
        public decimal? TotalTax => Receipt.TotalTax;
        public double? TotalAmountConfidence => Receipt.TotalAmountConfidence;
        public DateTime CreatedAt => Receipt.CreatedAt;
    }
}

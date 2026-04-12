using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReceiptTracker.Api.DTOs;
using ReceiptTracker.Core.Interfaces;

namespace ReceiptTracker.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class AnalyticsController : ControllerBase
{
    private readonly IAnalyticsService _analyticsService;
    private readonly ILogger<AnalyticsController> _logger;

    public AnalyticsController(
        IAnalyticsService analyticsService,
        ILogger<AnalyticsController> logger)
    {
        _analyticsService = analyticsService;
        _logger = logger;
    }

    /// <summary>
    /// Returns complete dashboard analytics data in a single request
    /// </summary>
    [HttpGet("dashboard")]
    [ProducesResponseType(typeof(AnalyticsDashboardDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetDashboard(
        [FromQuery] string currency = "BAM",
        CancellationToken ct = default)
    {
        var userId = GetUserId();
        var result = await _analyticsService.GetDashboardAsync(userId, currency, ct);

        var dto = new AnalyticsDashboardDto(
            MapToSpendingOverviewDto(result.SpendingOverview),
            result.SpendingTrends.Select(MapToMonthlyTrendDto).ToArray(),
            result.TopMerchants.Select(MapToMerchantSpendingDto).ToArray(),
            result.CategoryBreakdown.Select(MapToCategoryBreakdownDto).ToArray(),
            MapToTaxSummaryDto(result.TaxSummary),
            MapToTimeDistributionDto(result.TimeDistribution),
            MapToQuickStatsDto(result.QuickStats),
            result.Currency,
            result.GeneratedAt
        );

        return Ok(dto);
    }

    /// <summary>
    /// Returns spending overview (current month vs previous month)
    /// </summary>
    [HttpGet("spending/overview")]
    [ProducesResponseType(typeof(SpendingOverviewDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetSpendingOverview(
        [FromQuery] string currency = "BAM",
        CancellationToken ct = default)
    {
        var userId = GetUserId();
        var result = await _analyticsService.GetSpendingOverviewAsync(userId, currency, ct);

        return Ok(MapToSpendingOverviewDto(result));
    }

    /// <summary>
    /// Returns spending trends over time
    /// </summary>
    [HttpGet("spending/trends")]
    [ProducesResponseType(typeof(MonthlyTrendDto[]), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetSpendingTrends(
        [FromQuery] string granularity = "month",
        [FromQuery] int periods = 12,
        [FromQuery] string currency = "BAM",
        CancellationToken ct = default)
    {
        var userId = GetUserId();
        var result = await _analyticsService.GetSpendingTrendsAsync(userId, currency, granularity, periods, ct);

        return Ok(result.Select(MapToMonthlyTrendDto).ToArray());
    }

    /// <summary>
    /// Returns top merchants by spending
    /// </summary>
    [HttpGet("merchants")]
    [ProducesResponseType(typeof(MerchantSpendingDto[]), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetMerchantAnalytics(
        [FromQuery] int top = 10,
        [FromQuery] string currency = "BAM",
        CancellationToken ct = default)
    {
        var userId = GetUserId();
        var result = await _analyticsService.GetMerchantAnalyticsAsync(userId, currency, top, ct);

        return Ok(result.Select(MapToMerchantSpendingDto).ToArray());
    }

    /// <summary>
    /// Returns tax summary and breakdown
    /// </summary>
    [HttpGet("tax/summary")]
    [ProducesResponseType(typeof(TaxSummaryDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetTaxSummary(
        [FromQuery] int year = 0,
        CancellationToken ct = default)
    {
        var userId = GetUserId();
        var result = await _analyticsService.GetTaxSummaryAsync(userId, year, ct);

        return Ok(MapToTaxSummaryDto(result));
    }

    /// <summary>
    /// Returns time distribution analysis (day of week, hour)
    /// </summary>
    [HttpGet("time-distribution")]
    [ProducesResponseType(typeof(TimeDistributionDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetTimeDistribution(CancellationToken ct = default)
    {
        var userId = GetUserId();
        var result = await _analyticsService.GetTimeDistributionAsync(userId, ct);

        return Ok(MapToTimeDistributionDto(result));
    }

    /// <summary>
    /// Returns quick stats summary
    /// </summary>
    [HttpGet("quick-stats")]
    [ProducesResponseType(typeof(QuickStatsDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetQuickStats(
        [FromQuery] string currency = "BAM",
        CancellationToken ct = default)
    {
        var userId = GetUserId();
        var result = await _analyticsService.GetQuickStatsAsync(userId, currency, ct);

        return Ok(MapToQuickStatsDto(result));
    }

    private string GetUserId()
    {
        var userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub)
                    ?? User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userId))
            throw new UnauthorizedAccessException("Token does not contain a valid 'sub' claim.");

        return userId;
    }

    private static SpendingOverviewDto MapToSpendingOverviewDto(SpendingAnalyticsResult r) => new(
        r.CurrentMonthTotal,
        r.PreviousMonthTotal,
        r.PercentChange,
        r.IsIncrease,
        r.CurrentMonthReceiptCount,
        r.PreviousMonthReceiptCount,
        r.AverageReceiptAmount,
        r.YearToDateTotal
    );

    private static MonthlyTrendDto MapToMonthlyTrendDto(MonthlyTrendResult r) => new(
        r.PeriodStart,
        r.PeriodEnd,
        r.PeriodLabel,
        r.TotalAmount,
        r.ReceiptCount,
        r.AverageAmount,
        r.ProjectedAmount
    );

    private static MerchantSpendingDto MapToMerchantSpendingDto(MerchantAnalyticsResult r) => new(
        r.MerchantName,
        r.NormalizedName,
        r.TotalAmount,
        r.ReceiptCount,
        r.AverageAmount,
        r.FirstPurchase,
        r.LastPurchase,
        r.MonthlyTrends.Select(MapToMonthlyTrendDto).ToArray(),
        r.Category
    );

    private static CategoryBreakdownDto MapToCategoryBreakdownDto(CategoryBreakdownResult r) => new(
        r.Category,
        r.TotalAmount,
        r.PercentageOfTotal,
        r.ReceiptCount,
        r.Color
    );

    private static TaxSummaryDto MapToTaxSummaryDto(TaxAnalyticsResult r) => new(
        r.TotalTaxPaid,
        r.EffectiveTaxRate,
        r.DeductibleEstimate,
        r.TaxRates.Select(x => new TaxRateDistributionDto(x.Rate, x.TotalAmount, x.ReceiptCount)).ToArray(),
        r.MonthlyBreakdown.Select(x => new MonthlyTaxDto(x.Month, x.TotalTax, x.TotalAmount, x.TaxRate)).ToArray()
    );

    private static TimeDistributionDto MapToTimeDistributionDto(TimeDistributionResult r) => new(
        r.ByDayOfWeek.Select(x => new DayOfWeekDistributionDto(x.DayName, x.DayOfWeek, x.TotalAmount, x.ReceiptCount)).ToArray(),
        r.ByHour.Select(x => new HourDistributionDto(x.Hour, x.TimeLabel, x.TotalAmount, x.ReceiptCount)).ToArray(),
        new PeakSpendingDto(r.PeakSpending.PeakDay, r.PeakSpending.PeakTime, r.PeakSpending.PeakDayAmount, r.PeakSpending.PeakTimeAmount)
    );

    private static QuickStatsDto MapToQuickStatsDto(QuickStatsResult r) => new(
        r.TotalReceipts,
        r.ThisMonthReceipts,
        r.AllTimeTotal,
        r.UniqueMerchants,
        r.AverageConfidence,
        r.MostFrequentMerchant,
        r.FirstReceiptDate
    );
}

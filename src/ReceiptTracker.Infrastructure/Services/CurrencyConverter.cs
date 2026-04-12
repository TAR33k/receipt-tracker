using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using ReceiptTracker.Core.Interfaces;

namespace ReceiptTracker.Infrastructure.Services;

public class CurrencyConverter : ICurrencyConverter
{
    private readonly HttpClient _httpClient;
    private readonly IMemoryCache _cache;
    private readonly ILogger<CurrencyConverter> _logger;

    private const string BASE_CURRENCY = "EUR";
    private const string CACHE_KEY = "exchange_rates_EUR";
    private static readonly TimeSpan CACHE_DURATION = TimeSpan.FromHours(1);

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
    };

    public CurrencyConverter(
        HttpClient httpClient,
        IMemoryCache cache,
        ILogger<CurrencyConverter> logger)
    {
        _httpClient = httpClient;
        _cache = cache;
        _logger = logger;
    }

    public async Task<ExchangeRates> GetExchangeRatesAsync(string baseCurrency)
    {
        if (_cache.TryGetValue(CACHE_KEY, out ExchangeRates? cached) && cached != null)
            return cached;

        try
        {
            var response = await _httpClient.GetAsync(
                $"https://api.exchangerate-api.com/v4/latest/{BASE_CURRENCY}");

            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            var data = JsonSerializer.Deserialize<ExchangeRateApiResponse>(content, JsonOptions);

            if (data?.Rates == null || data.Rates.Count == 0)
                throw new InvalidOperationException(
                    "Exchange rate API returned an empty or malformed response.");

            var rates = new ExchangeRates
            {
                Base = BASE_CURRENCY,
                Date = data.Date ?? DateOnly.FromDateTime(DateTime.UtcNow).ToString(),
                Rates = data.Rates.ToDictionary(
                    kvp => kvp.Key.ToUpperInvariant(),
                    kvp => (decimal)kvp.Value),
            };

            rates.Rates[BASE_CURRENCY] = 1m;

            _cache.Set(CACHE_KEY, rates, CACHE_DURATION);

            _logger.LogInformation(
                "Exchange rates fetched successfully. {Count} currencies available.",
                rates.Rates.Count);

            return rates;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to fetch exchange rates from API.");
            throw;
        }
    }

    public decimal Convert(decimal amount, string fromCurrency, string toCurrency)
    {
        if (string.IsNullOrWhiteSpace(fromCurrency) || string.IsNullOrWhiteSpace(toCurrency))
            return amount;

        var from = fromCurrency.ToUpperInvariant();
        var to = toCurrency.ToUpperInvariant();

        if (from == to)
            return amount;

        if (!_cache.TryGetValue(CACHE_KEY, out ExchangeRates? rates) || rates == null)
        {
            _logger.LogWarning(
                "Exchange rates not cached — cannot convert {From} → {To}. " +
                "Ensure PrefetchExchangeRates is called before Convert.",
                from, to);
            return amount;
        }

        decimal eurAmount;

        if (from == BASE_CURRENCY)
        {
            eurAmount = amount;
        }
        else if (rates.Rates.TryGetValue(from, out decimal fromRate) && fromRate > 0)
        {
            eurAmount = amount / fromRate;
        }
        else
        {
            _logger.LogWarning("No exchange rate available for source currency {Currency}.", from);
            return amount;
        }

        if (to == BASE_CURRENCY)
            return decimal.Round(eurAmount, 4);

        if (rates.Rates.TryGetValue(to, out decimal toRate) && toRate > 0)
            return decimal.Round(eurAmount * toRate, 4);

        _logger.LogWarning("No exchange rate available for target currency {Currency}.", to);
        return amount;
    }

    private sealed class ExchangeRateApiResponse
    {
        public string? Base { get; set; }
        public string? Date { get; set; }
        public Dictionary<string, double>? Rates { get; set; }
    }
}

namespace ReceiptTracker.Core.Interfaces;

public interface ICurrencyConverter
{
    Task<ExchangeRates> GetExchangeRatesAsync(string baseCurrency);
    decimal Convert(decimal amount, string fromCurrency, string toCurrency);
}

public class ExchangeRates
{
    public string Base { get; set; } = string.Empty;
    public Dictionary<string, decimal> Rates { get; set; } = new();
    public string Date { get; set; } = string.Empty;
}

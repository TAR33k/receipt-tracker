namespace ReceiptTracker.Api.DTOs;

public record ReceiptReviewDto(
    string? MerchantName,
    decimal? TotalAmount,
    DateTime? TransactionDate,
    string? Currency,
    string? TaxId,
    string? FiscalReceiptNumber
);
using ReceiptTracker.Core.Models;

namespace ReceiptTracker.Api.DTOs;

public record ReceiptDto(
    Guid Id,
    string Status,
    string? MerchantName,
    decimal? TotalAmount,
    DateTime? TransactionDate,
    TimeSpan? TransactionTime,
    string? Currency,
    double? MerchantNameConfidence,
    double? TotalAmountConfidence,
    double? TransactionDateConfidence,
    double? TransactionTimeConfidence,
    string? CountryRegion,
    double? CountryRegionConfidence,
    string? ReceiptType,
    double? ReceiptTypeConfidence,
    decimal? TotalTax,
    string? TotalTaxCurrency,
    double? TotalTaxConfidence,
    List<ReceiptItem> Items,
    MerchantAddress? MerchantAddress,
    List<TaxDetail> TaxDetails,
    DateTime CreatedAt,
    DateTime? ProcessedAt,
    bool NeedsReview,
    string? ErrorMessage
);

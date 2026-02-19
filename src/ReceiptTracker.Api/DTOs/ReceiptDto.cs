namespace ReceiptTracker.Api.DTOs;

public record ReceiptDto(
    Guid Id,
    string Status,
    string? MerchantName,
    decimal? TotalAmount,
    DateTime? TransactionDate,
    string? Currency,
    double? MerchantNameConfidence,
    double? TotalAmountConfidence,
    double? TransactionDateConfidence,
    DateTime CreatedAt,
    DateTime? ProcessedAt,
    bool NeedsReview,
    string? ErrorMessage
);
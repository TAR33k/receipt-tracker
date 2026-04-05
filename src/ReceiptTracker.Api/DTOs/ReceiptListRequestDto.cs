using ReceiptTracker.Core.Enums;

namespace ReceiptTracker.Api.DTOs;

public record ReceiptListRequestDto(
    string? Search = null,
    ReceiptStatus? Status = null,
    DateTime? DateFrom = null,
    DateTime? DateTo = null,
    decimal? AmountMin = null,
    decimal? AmountMax = null,
    string? SortBy = null,
    string? SortDirection = null,
    int Page = 1,
    int PerPage = 20
);

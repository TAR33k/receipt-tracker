namespace ReceiptTracker.Api.DTOs;

public record PagedReceiptsResponseDto(
    List<ReceiptDto> Data,
    PaginationMetadataDto Pagination
);

public record PaginationMetadataDto(
    int TotalCount,
    int Page,
    int PerPage,
    int TotalPages,
    bool HasNextPage,
    bool HasPrevPage
);

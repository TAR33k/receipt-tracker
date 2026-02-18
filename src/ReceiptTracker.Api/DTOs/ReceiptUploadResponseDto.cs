namespace ReceiptTracker.Api.DTOs;

public record ReceiptUploadResponseDto(
    Guid ReceiptId,
    string Status,
    string Message
);
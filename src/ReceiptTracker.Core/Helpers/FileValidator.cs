namespace ReceiptTracker.Core.Helpers;

public static class FileValidator
{
    public static readonly string[] AllowedContentTypes =
        ["image/jpeg", "image/png", "application/pdf"];

    public const long MaxFileSizeBytes = 10L * 1024 * 1024; // 10 MB

    public static bool IsContentTypeAllowed(string? contentType)
    {
        if (string.IsNullOrWhiteSpace(contentType)) return false;
        return AllowedContentTypes.Contains(contentType, StringComparer.OrdinalIgnoreCase);
    }

    public static bool HasValidMagicBytes(Stream stream, string contentType)
    {
        if (!stream.CanSeek) throw new ArgumentException("Stream must be seekable.", nameof(stream));
        if (stream.Length < 4) return false;

        var buffer = new byte[4];
        var originalPosition = stream.Position;

        stream.Position = 0;
        _ = stream.Read(buffer, 0, 4);
        stream.Position = originalPosition;

        return contentType.ToLowerInvariant() switch
        {
            "image/jpeg" =>
                buffer[0] == 0xFF && buffer[1] == 0xD8 && buffer[2] == 0xFF,
            "image/png" =>
                buffer[0] == 0x89 && buffer[1] == 0x50 && buffer[2] == 0x4E && buffer[3] == 0x47,
            "application/pdf" =>
                buffer[0] == 0x25 && buffer[1] == 0x50 && buffer[2] == 0x44 && buffer[3] == 0x46,
            _ => false
        };
    }

    public static string GetExtension(string contentType) => contentType.ToLowerInvariant() switch
    {
        "image/jpeg"      => ".jpg",
        "image/png"       => ".png",
        "application/pdf" => ".pdf",
        _ => throw new ArgumentException($"Unsupported content type: {contentType}")
    };
}
namespace ReceiptTracker.Core.Interfaces;

public interface IBlobStorageService
{
    /// <summary>
    /// Uploads a file stream to the quarantine container.
    /// </summary>
    /// <param name="stream">File content — must be a seekable MemoryStream</param>
    /// <param name="blobName">Path within the container: "{userId}/{receiptId}{extension}"</param>
    /// <param name="contentType">MIME type — stored as blob metadata for correct browser rendering</param>
    Task UploadToQuarantineAsync(Stream stream, string blobName, string contentType);
}
namespace ReceiptTracker.Core.Interfaces;

public interface IBlobStorageService
{
    Task UploadToQuarantineAsync(Stream stream, string blobName, string contentType);
    Task MoveBlobToProcessedAsync(string blobName);
}
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using ReceiptTracker.Core.Interfaces;

namespace ReceiptTracker.Infrastructure.Services;

public class BlobStorageService : IBlobStorageService
{
    private readonly BlobServiceClient _blobServiceClient;
    private const string QuarantineContainer = "receipts-quarantine";
    private const string ProcessedContainer  = "receipts-processed";

    public BlobStorageService(BlobServiceClient blobServiceClient)
    {
        _blobServiceClient = blobServiceClient;
    }

    public async Task UploadToQuarantineAsync(Stream stream, string blobName, string contentType)
    {
        var containerClient = _blobServiceClient.GetBlobContainerClient(QuarantineContainer);
        var blobClient = containerClient.GetBlobClient(blobName);

        await blobClient.UploadAsync(stream, new BlobUploadOptions
        {
            HttpHeaders = new BlobHttpHeaders { ContentType = contentType }
        });
    }

    public async Task MoveBlobToProcessedAsync(string blobName)
    {
        var sourceContainer = _blobServiceClient.GetBlobContainerClient(QuarantineContainer);
        var destinationContainer = _blobServiceClient.GetBlobContainerClient(ProcessedContainer);

        var sourceBlob = sourceContainer.GetBlobClient(blobName);
        var destinationBlob = destinationContainer.GetBlobClient(blobName);

        var copyOperation = await destinationBlob.StartCopyFromUriAsync(sourceBlob.Uri);

        await copyOperation.WaitForCompletionAsync();

        await sourceBlob.DeleteIfExistsAsync();
    }
}
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using ReceiptTracker.Core.Interfaces;

namespace ReceiptTracker.Infrastructure.Services;

public class BlobStorageService : IBlobStorageService
{
    private readonly BlobServiceClient _blobServiceClient;
    private const string QuarantineContainer = "receipts-quarantine";

    public BlobStorageService(BlobServiceClient blobServiceClient)
    {
        _blobServiceClient = blobServiceClient;
    }

    public async Task UploadToQuarantineAsync(Stream stream, string blobName, string contentType)
    {
        var containerClient = _blobServiceClient.GetBlobContainerClient(QuarantineContainer);
        var blobClient = containerClient.GetBlobClient(blobName);

        var options = new BlobUploadOptions
        {
            HttpHeaders = new BlobHttpHeaders
            {
                ContentType = contentType
            }
        };

        await blobClient.UploadAsync(stream, options);
    }
}
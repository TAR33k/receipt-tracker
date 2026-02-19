using Azure;
using Azure.AI.DocumentIntelligence;
using Azure.Storage.Blobs;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using ReceiptTracker.Core.Interfaces;
using ReceiptTracker.Infrastructure.Data;
using ReceiptTracker.Infrastructure.Repositories;
using ReceiptTracker.Infrastructure.Services;

var host = new HostBuilder()
    .ConfigureFunctionsWorkerDefaults()
    .ConfigureServices((context, services) =>
    {
        var config = context.Configuration;

        services.AddDbContext<AppDbContext>(options =>
            options.UseSqlServer(
                config["SqlConnection"],
                sqlOptions => sqlOptions.EnableRetryOnFailure(
                    maxRetryCount: 5,
                    maxRetryDelay: TimeSpan.FromSeconds(30),
                    errorNumbersToAdd: null)));

        services.AddSingleton(_ =>
            new BlobServiceClient(config["AzureWebJobsStorage"]));

        services.AddSingleton(_ =>
            new DocumentIntelligenceClient(
                new Uri(config["DocumentIntelligenceEndpoint"]!),
                new AzureKeyCredential(config["DocumentIntelligenceKey"]!)));

        services.AddScoped<IReceiptRepository, ReceiptRepository>();
        services.AddScoped<IBlobStorageService, BlobStorageService>();
        services.AddScoped<IDocumentIntelligenceService, DocumentIntelligenceService>();
    })
    .Build();

await host.RunAsync();
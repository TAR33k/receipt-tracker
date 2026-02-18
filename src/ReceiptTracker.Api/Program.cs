using Azure.Storage.Blobs;
using Microsoft.EntityFrameworkCore;
using ReceiptTracker.Api.Filters;
using ReceiptTracker.Core.Interfaces;
using ReceiptTracker.Infrastructure.Data;
using ReceiptTracker.Infrastructure.Repositories;
using ReceiptTracker.Infrastructure.Services;

var builder = WebApplication.CreateBuilder(args);

// Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("SqlConnection"),
        sqlOptions => sqlOptions.EnableRetryOnFailure(
            maxRetryCount: 5,
            maxRetryDelay: TimeSpan.FromSeconds(30),
            errorNumbersToAdd: null)));

// Azure Blob Storage
builder.Services.AddSingleton(_ =>
    new BlobServiceClient(builder.Configuration["Azure:StorageConnectionString"]));

// Dependency Injection
builder.Services.AddScoped<IReceiptRepository, ReceiptRepository>();
builder.Services.AddScoped<IBlobStorageService, BlobStorageService>();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        var staticWebAppOrigin = builder.Configuration["AllowedOrigins:StaticWebApp"];

        policy
            .WithOrigins(
                "http://localhost:5173",
                staticWebAppOrigin ?? "")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// Application Insights
var appInsightsConnectionString = builder.Configuration["APPLICATIONINSIGHTS_CONNECTION_STRING"];
if (!string.IsNullOrEmpty(appInsightsConnectionString))
{
    builder.Services.AddApplicationInsightsTelemetry();
}

// Web API and Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new()
    {
        Title = "Receipt Tracker API",
        Version = "v1",
        Description = "Receipt processing API"
    });

    options.OperationFilter<UserIdHeaderOperationFilter>();
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

    try
    {
        logger.LogInformation("Applying database migrations...");
        await db.Database.MigrateAsync();
        logger.LogInformation("Database migrations applied successfully.");
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Failed to apply database migrations on startup.");
    }
}

app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "Receipt Tracker API v1");
    options.RoutePrefix = "swagger";
});

app.UseCors("FrontendPolicy");
app.MapControllers();
app.Run();
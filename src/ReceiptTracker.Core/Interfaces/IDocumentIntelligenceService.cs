using ReceiptTracker.Core.Models;

namespace ReceiptTracker.Core.Interfaces;

public interface IDocumentIntelligenceService
{
    Task<ReceiptExtractionResult> ExtractReceiptDataAsync(Stream receiptStream);
}
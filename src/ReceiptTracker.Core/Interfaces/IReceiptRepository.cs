using ReceiptTracker.Core.Entities;
using ReceiptTracker.Core.Enums;

namespace ReceiptTracker.Core.Interfaces;

public interface IReceiptRepository
{
    Task<Receipt> CreateAsync(Receipt receipt);
    Task<Receipt?> GetByIdAsync(Guid id, string userId);
    Task<IEnumerable<Receipt>> GetAllByUserAsync(string userId);
    Task<IEnumerable<Receipt>> GetPagedAsync(
        string userId,
        string? search = null,
        string? status = null,
        DateTime? dateFrom = null,
        DateTime? dateTo = null,
        decimal? amountMin = null,
        decimal? amountMax = null,
        string? sortBy = null,
        string? sortDirection = null,
        int page = 1,
        int perPage = 20,
        CancellationToken ct = default);
    Task<int> GetCountAsync(
        string userId,
        string? search = null,
        string? status = null,
        DateTime? dateFrom = null,
        DateTime? dateTo = null,
        decimal? amountMin = null,
        decimal? amountMax = null,
        CancellationToken ct = default);
    Task<Receipt> UpdateAsync(Receipt receipt);

    // Analytics queries
    Task<IEnumerable<Receipt>> GetForAnalyticsAsync(
        string userId,
        DateTime? from = null,
        DateTime? to = null,
        ReceiptStatus? status = null,
        CancellationToken ct = default);
}

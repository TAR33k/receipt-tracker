using ReceiptTracker.Core.Entities;

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
}

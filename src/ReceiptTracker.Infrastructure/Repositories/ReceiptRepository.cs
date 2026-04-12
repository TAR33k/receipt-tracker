using Microsoft.EntityFrameworkCore;
using ReceiptTracker.Core.Entities;
using ReceiptTracker.Core.Enums;
using ReceiptTracker.Core.Interfaces;
using ReceiptTracker.Infrastructure.Data;

namespace ReceiptTracker.Infrastructure.Repositories;

public class ReceiptRepository : IReceiptRepository
{
    private readonly AppDbContext _context;

    public ReceiptRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Receipt>> GetForAnalyticsAsync(
        string userId,
        DateTime? from = null,
        DateTime? to = null,
        ReceiptStatus? status = null,
        CancellationToken ct = default)
    {
        var query = _context.Receipts
            .Where(r => r.UserId == userId);

        if (status.HasValue)
        {
            query = query.Where(r => r.Status == status.Value);
        }

        if (from.HasValue)
            query = query.Where(r => r.TransactionDate >= from.Value);

        if (to.HasValue)
            query = query.Where(r => r.TransactionDate <= to.Value);

        return await query
            .OrderByDescending(r => r.TransactionDate)
            .ToListAsync(ct);
    }

    public async Task<Receipt> CreateAsync(Receipt receipt)
    {
        _context.Receipts.Add(receipt);
        await _context.SaveChangesAsync();
        return receipt;
    }

    public async Task<Receipt?> GetByIdAsync(Guid id, string userId)
    {
        return await _context.Receipts
            .FirstOrDefaultAsync(r => r.Id == id && r.UserId == userId);
    }

    public async Task<IEnumerable<Receipt>> GetAllByUserAsync(string userId)
    {
        return await _context.Receipts
            .Where(r => r.UserId == userId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
    }

    public async Task<Receipt> UpdateAsync(Receipt receipt)
    {
        _context.Receipts.Update(receipt);
        await _context.SaveChangesAsync();
        return receipt;
    }

    public async Task<IEnumerable<Receipt>> GetPagedAsync(
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
        CancellationToken ct = default)
    {
        var query = _context.Receipts
            .Where(r => r.UserId == userId);

        if (!string.IsNullOrWhiteSpace(search))
        {
            var searchTerm = search.Trim().ToLower();
            query = query.Where(r => r.MerchantName != null && r.MerchantName.ToLower().Contains(searchTerm));
        }

        if (!string.IsNullOrWhiteSpace(status) && Enum.TryParse<ReceiptStatus>(status, out var statusEnum))
        {
            query = query.Where(r => r.Status == statusEnum);
        }

        if (dateFrom.HasValue)
            query = query.Where(r => r.TransactionDate >= dateFrom.Value);
        if (dateTo.HasValue)
            query = query.Where(r => r.TransactionDate <= dateTo.Value);

        if (amountMin.HasValue)
            query = query.Where(r => r.TotalAmount >= amountMin.Value);
        if (amountMax.HasValue)
            query = query.Where(r => r.TotalAmount <= amountMax.Value);

        query = sortBy?.ToLower() switch
        {
            "transactiondate" => sortDirection?.ToLower() == "asc"
                ? query.OrderBy(r => r.TransactionDate)
                : query.OrderByDescending(r => r.TransactionDate),
            "amount" => sortDirection?.ToLower() == "asc"
                ? query.OrderBy(r => r.TotalAmount)
                : query.OrderByDescending(r => r.TotalAmount),
            "createdat" => sortDirection?.ToLower() == "asc"
                ? query.OrderBy(r => r.CreatedAt)
                : query.OrderByDescending(r => r.CreatedAt),
            _ => query.OrderByDescending(r => r.CreatedAt) // Default
        };

        var skip = (page - 1) * perPage;
        var items = await query
            .Skip(skip)
            .Take(perPage)
            .ToListAsync(ct);

        return items;
    }

    public async Task<int> GetCountAsync(
        string userId,
        string? search = null,
        string? status = null,
        DateTime? dateFrom = null,
        DateTime? dateTo = null,
        decimal? amountMin = null,
        decimal? amountMax = null,
        CancellationToken ct = default)
    {
        var query = _context.Receipts
            .Where(r => r.UserId == userId);

        if (!string.IsNullOrWhiteSpace(search))
        {
            var searchTerm = search.Trim().ToLower();
            query = query.Where(r => r.MerchantName != null && r.MerchantName.ToLower().Contains(searchTerm));
        }

        if (!string.IsNullOrWhiteSpace(status) && Enum.TryParse<ReceiptStatus>(status, out var statusEnum))
        {
            query = query.Where(r => r.Status == statusEnum);
        }

        if (dateFrom.HasValue)
            query = query.Where(r => r.TransactionDate >= dateFrom.Value);
        if (dateTo.HasValue)
            query = query.Where(r => r.TransactionDate <= dateTo.Value);

        if (amountMin.HasValue)
            query = query.Where(r => r.TotalAmount >= amountMin.Value);
        if (amountMax.HasValue)
            query = query.Where(r => r.TotalAmount <= amountMax.Value);

        return await query.CountAsync(ct);
    }
}

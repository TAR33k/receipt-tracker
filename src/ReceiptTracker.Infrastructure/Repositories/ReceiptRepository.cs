using Microsoft.EntityFrameworkCore;
using ReceiptTracker.Core.Entities;
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

    public Task<IEnumerable<Receipt>> GetPagedAsync(
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
        throw new NotImplementedException("Pagination will be implemented in Phase 2");
    }

    public Task<int> GetCountAsync(
        string userId,
        string? search = null,
        string? status = null,
        DateTime? dateFrom = null,
        DateTime? dateTo = null,
        decimal? amountMin = null,
        decimal? amountMax = null,
        CancellationToken ct = default)
    {
        throw new NotImplementedException("Count will be implemented in Phase 2");
    }
}
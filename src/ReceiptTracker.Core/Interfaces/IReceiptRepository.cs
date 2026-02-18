using ReceiptTracker.Core.Entities;

namespace ReceiptTracker.Core.Interfaces;

public interface IReceiptRepository
{
    Task<Receipt> CreateAsync(Receipt receipt);
    Task<Receipt?> GetByIdAsync(Guid id, string userId);
    Task<IEnumerable<Receipt>> GetAllByUserAsync(string userId);
    Task<Receipt> UpdateAsync(Receipt receipt);
}
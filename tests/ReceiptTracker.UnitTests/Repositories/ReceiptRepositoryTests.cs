using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using ReceiptTracker.Core.Entities;
using ReceiptTracker.Core.Enums;
using ReceiptTracker.Infrastructure.Data;
using ReceiptTracker.Infrastructure.Repositories;

namespace ReceiptTracker.UnitTests.Repositories;

public class ReceiptRepositoryTests : IDisposable
{
    private readonly AppDbContext _context;
    private readonly ReceiptRepository _repository;

    public ReceiptRepositoryTests()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _context = new AppDbContext(options);
        _repository = new ReceiptRepository(_context);
    }

    public void Dispose()
    {
        _context.Database.EnsureDeleted();
        _context.Dispose();
    }

    [Fact]
    public async Task CreateAsync_ValidReceipt_AssignsIdAndPersists()
    {
        var receipt = BuildReceipt("user-a");

        var result = await _repository.CreateAsync(receipt);

        result.Id.Should().NotBeEmpty();
        result.UserId.Should().Be("user-a");

        var inDb = await _context.Receipts.FindAsync(result.Id);
        inDb.Should().NotBeNull();
    }

    [Fact]
    public async Task GetByIdAsync_OwnReceipt_ReturnsReceipt()
    {
        var receipt = await _repository.CreateAsync(BuildReceipt("user-a"));

        var result = await _repository.GetByIdAsync(receipt.Id, "user-a");

        result.Should().NotBeNull();
        result!.Id.Should().Be(receipt.Id);
    }

    [Fact]
    public async Task GetByIdAsync_DifferentUser_ReturnsNull()
    {
        var receipt = await _repository.CreateAsync(BuildReceipt("user-a"));

        var result = await _repository.GetByIdAsync(receipt.Id, "user-b");

        result.Should().BeNull("a different user must not access another user's receipt");
    }

    [Fact]
    public async Task GetByIdAsync_NonExistentId_ReturnsNull()
    {
        var result = await _repository.GetByIdAsync(Guid.NewGuid(), "user-a");

        result.Should().BeNull();
    }

    [Fact]
    public async Task GetAllByUserAsync_ReturnsOnlyOwnReceipts()
    {
        await _repository.CreateAsync(BuildReceipt("user-a"));
        await _repository.CreateAsync(BuildReceipt("user-a"));
        await _repository.CreateAsync(BuildReceipt("user-b"));

        var results = await _repository.GetAllByUserAsync("user-a");

        results.Should().HaveCount(2, "only user-a's receipts should be returned");
        results.Should().AllSatisfy(r => r.UserId.Should().Be("user-a"));
    }

    [Fact]
    public async Task GetAllByUserAsync_OrderedNewestFirst()
    {
        var older = BuildReceipt("user-a");
        older.CreatedAt = DateTime.UtcNow.AddHours(-2);
        var newer = BuildReceipt("user-a");
        newer.CreatedAt = DateTime.UtcNow;

        await _repository.CreateAsync(older);
        await _repository.CreateAsync(newer);

        var results = (await _repository.GetAllByUserAsync("user-a")).ToList();

        results[0].CreatedAt.Should().BeAfter(results[1].CreatedAt,
            "most recent receipts should appear first");
    }

    [Fact]
    public async Task UpdateAsync_ChangesStatus_PersistsChange()
    {
        var receipt = await _repository.CreateAsync(BuildReceipt("user-a"));
        receipt.Status = ReceiptStatus.Completed;
        receipt.MerchantName = "Test Store";

        await _repository.UpdateAsync(receipt);

        _context.ChangeTracker.Clear();
        var reloaded = await _repository.GetByIdAsync(receipt.Id, "user-a");

        reloaded!.Status.Should().Be(ReceiptStatus.Completed);
        reloaded.MerchantName.Should().Be("Test Store");
    }

    private static Receipt BuildReceipt(string userId) => new()
    {
        Id = Guid.NewGuid(),
        UserId = userId,
        OriginalFileName = "receipt.jpg",
        BlobName = $"{userId}/{Guid.NewGuid()}.jpg",
        Status = ReceiptStatus.Uploaded,
        CreatedAt = DateTime.UtcNow
    };
}
using Microsoft.EntityFrameworkCore;
using ReceiptTracker.Core.Entities;

namespace ReceiptTracker.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Receipt> Receipts => Set<Receipt>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Receipt>(entity =>
        {
            entity.HasKey(r => r.Id);

            entity.Property(r => r.UserId)
                .IsRequired()
                .HasMaxLength(256);

            entity.Property(r => r.OriginalFileName)
                .IsRequired()
                .HasMaxLength(512);

            entity.Property(r => r.BlobName)
                .IsRequired()
                .HasMaxLength(1024);

            entity.Property(r => r.TotalAmount)
                .HasPrecision(18, 2);

            entity.Property(r => r.MerchantName)
                .HasMaxLength(512);

            entity.Property(r => r.Currency)
                .HasMaxLength(10);

            entity.HasIndex(r => r.UserId)
                .HasDatabaseName("IX_Receipts_UserId");

            entity.HasIndex(r => new { r.UserId, r.CreatedAt })
                .HasDatabaseName("IX_Receipts_UserId_CreatedAt");
        });
    }
}
using Microsoft.EntityFrameworkCore;
using ReceiptTracker.Core.Entities;
using ReceiptTracker.Core.Models;

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

            entity.Property(r => r.TotalTax)
                .HasPrecision(18, 2);

            entity.Property(r => r.MerchantName)
                .HasMaxLength(512);

            entity.Property(r => r.Currency)
                .HasMaxLength(10);

            entity.Property(r => r.TotalTaxCurrency)
                .HasMaxLength(10);

            entity.Property(r => r.CountryRegion)
                .HasMaxLength(100);

            entity.Property(r => r.ReceiptType)
                .HasMaxLength(100);

            entity.OwnsOne(r => r.MerchantAddress, address =>
            {
                address.Property(a => a.HouseNumber).HasMaxLength(50);
                address.Property(a => a.Road).HasMaxLength(200);
                address.Property(a => a.PostalCode).HasMaxLength(20);
                address.Property(a => a.City).HasMaxLength(100);
                address.Property(a => a.State).HasMaxLength(100);
                address.Property(a => a.CountryRegion).HasMaxLength(100);
                address.Property(a => a.StreetAddress).HasMaxLength(300);
                address.Property(a => a.FullAddress).HasMaxLength(500);
            });

            entity.OwnsMany(r => r.Items, item =>
            {
                item.Property(i => i.Content).HasMaxLength(500);
                item.Property(i => i.Description).HasMaxLength(500);
                item.Property(i => i.Price).HasPrecision(18, 2);
                item.Property(i => i.PriceCurrency).HasMaxLength(10);
                item.Property(i => i.TotalPrice).HasPrecision(18, 2);
                item.Property(i => i.TotalPriceCurrency).HasMaxLength(10);
            });

            entity.OwnsMany(r => r.TaxDetails, tax =>
            {
                tax.Property(t => t.Content).HasMaxLength(500);
                tax.Property(t => t.Description).HasMaxLength(500);
                tax.Property(t => t.Amount).HasPrecision(18, 2);
                tax.Property(t => t.AmountCurrency).HasMaxLength(10);
                tax.Property(t => t.NetAmount).HasPrecision(18, 2);
                tax.Property(t => t.NetAmountCurrency).HasMaxLength(10);
            });

            entity.HasIndex(r => r.UserId)
                .HasDatabaseName("IX_Receipts_UserId");

            entity.HasIndex(r => new { r.UserId, r.CreatedAt })
                .HasDatabaseName("IX_Receipts_UserId_CreatedAt");

            entity.HasIndex(r => new { r.UserId, r.MerchantName })
                .HasDatabaseName("IX_Receipts_UserId_MerchantName");

            entity.HasIndex(r => new { r.UserId, r.TransactionDate })
                .HasDatabaseName("IX_Receipts_UserId_TransactionDate");

            entity.HasIndex(r => new { r.UserId, r.TotalAmount })
                .HasDatabaseName("IX_Receipts_UserId_TotalAmount");

            entity.HasIndex(r => new { r.UserId, r.Status })
                .HasDatabaseName("IX_Receipts_UserId_Status");
        });
    }
}
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReceiptTracker.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddQueryOptimizationIndexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Receipts_UserId_MerchantName",
                table: "Receipts",
                columns: new[] { "UserId", "MerchantName" });

            migrationBuilder.CreateIndex(
                name: "IX_Receipts_UserId_Status",
                table: "Receipts",
                columns: new[] { "UserId", "Status" });

            migrationBuilder.CreateIndex(
                name: "IX_Receipts_UserId_TotalAmount",
                table: "Receipts",
                columns: new[] { "UserId", "TotalAmount" });

            migrationBuilder.CreateIndex(
                name: "IX_Receipts_UserId_TransactionDate",
                table: "Receipts",
                columns: new[] { "UserId", "TransactionDate" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Receipts_UserId_MerchantName",
                table: "Receipts");

            migrationBuilder.DropIndex(
                name: "IX_Receipts_UserId_Status",
                table: "Receipts");

            migrationBuilder.DropIndex(
                name: "IX_Receipts_UserId_TotalAmount",
                table: "Receipts");

            migrationBuilder.DropIndex(
                name: "IX_Receipts_UserId_TransactionDate",
                table: "Receipts");
        }
    }
}

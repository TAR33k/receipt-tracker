using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReceiptTracker.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class ExpandReceiptDataFixed : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "MerchantAddress_CountryRegion",
                table: "Receipts",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "MerchantAddress_CountryRegionConfidence",
                table: "Receipts",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MerchantAddress_State",
                table: "Receipts",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "MerchantAddress_StateConfidence",
                table: "Receipts",
                type: "float",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MerchantAddress_CountryRegion",
                table: "Receipts");

            migrationBuilder.DropColumn(
                name: "MerchantAddress_CountryRegionConfidence",
                table: "Receipts");

            migrationBuilder.DropColumn(
                name: "MerchantAddress_State",
                table: "Receipts");

            migrationBuilder.DropColumn(
                name: "MerchantAddress_StateConfidence",
                table: "Receipts");
        }
    }
}

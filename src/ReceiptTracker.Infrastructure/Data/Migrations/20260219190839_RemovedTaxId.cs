using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReceiptTracker.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class RemovedTaxId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FiscalReceiptNumber",
                table: "Receipts");

            migrationBuilder.DropColumn(
                name: "TaxId",
                table: "Receipts");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FiscalReceiptNumber",
                table: "Receipts",
                type: "nvarchar(128)",
                maxLength: 128,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TaxId",
                table: "Receipts",
                type: "nvarchar(64)",
                maxLength: 64,
                nullable: true);
        }
    }
}

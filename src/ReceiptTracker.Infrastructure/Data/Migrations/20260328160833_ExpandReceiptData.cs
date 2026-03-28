using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReceiptTracker.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class ExpandReceiptData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CountryRegion",
                table: "Receipts",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "CountryRegionConfidence",
                table: "Receipts",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MerchantAddress_City",
                table: "Receipts",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "MerchantAddress_CityConfidence",
                table: "Receipts",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MerchantAddress_FullAddress",
                table: "Receipts",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "MerchantAddress_FullAddressConfidence",
                table: "Receipts",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MerchantAddress_HouseNumber",
                table: "Receipts",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "MerchantAddress_HouseNumberConfidence",
                table: "Receipts",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MerchantAddress_PostalCode",
                table: "Receipts",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "MerchantAddress_PostalCodeConfidence",
                table: "Receipts",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MerchantAddress_Road",
                table: "Receipts",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "MerchantAddress_RoadConfidence",
                table: "Receipts",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MerchantAddress_StreetAddress",
                table: "Receipts",
                type: "nvarchar(300)",
                maxLength: 300,
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "MerchantAddress_StreetAddressConfidence",
                table: "Receipts",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ReceiptType",
                table: "Receipts",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "ReceiptTypeConfidence",
                table: "Receipts",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "TotalTax",
                table: "Receipts",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "TotalTaxConfidence",
                table: "Receipts",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TotalTaxCurrency",
                table: "Receipts",
                type: "nvarchar(10)",
                maxLength: 10,
                nullable: true);

            migrationBuilder.AddColumn<TimeSpan>(
                name: "TransactionTime",
                table: "Receipts",
                type: "time",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "TransactionTimeConfidence",
                table: "Receipts",
                type: "float",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ReceiptItem",
                columns: table => new
                {
                    ReceiptId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Content = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    ContentConfidence = table.Column<double>(type: "float", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    DescriptionConfidence = table.Column<double>(type: "float", nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    PriceCurrency = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    PriceConfidence = table.Column<double>(type: "float", nullable: false),
                    Quantity = table.Column<double>(type: "float", nullable: true),
                    QuantityConfidence = table.Column<double>(type: "float", nullable: false),
                    TotalPrice = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    TotalPriceCurrency = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    TotalPriceConfidence = table.Column<double>(type: "float", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReceiptItem", x => new { x.ReceiptId, x.Id });
                    table.ForeignKey(
                        name: "FK_ReceiptItem_Receipts_ReceiptId",
                        column: x => x.ReceiptId,
                        principalTable: "Receipts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TaxDetail",
                columns: table => new
                {
                    ReceiptId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Content = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    ContentConfidence = table.Column<double>(type: "float", nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    AmountCurrency = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    AmountConfidence = table.Column<double>(type: "float", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    DescriptionConfidence = table.Column<double>(type: "float", nullable: false),
                    NetAmount = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    NetAmountCurrency = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    NetAmountConfidence = table.Column<double>(type: "float", nullable: false),
                    Rate = table.Column<double>(type: "float", nullable: true),
                    RateConfidence = table.Column<double>(type: "float", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TaxDetail", x => new { x.ReceiptId, x.Id });
                    table.ForeignKey(
                        name: "FK_TaxDetail_Receipts_ReceiptId",
                        column: x => x.ReceiptId,
                        principalTable: "Receipts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ReceiptItem");

            migrationBuilder.DropTable(
                name: "TaxDetail");

            migrationBuilder.DropColumn(
                name: "CountryRegion",
                table: "Receipts");

            migrationBuilder.DropColumn(
                name: "CountryRegionConfidence",
                table: "Receipts");

            migrationBuilder.DropColumn(
                name: "MerchantAddress_City",
                table: "Receipts");

            migrationBuilder.DropColumn(
                name: "MerchantAddress_CityConfidence",
                table: "Receipts");

            migrationBuilder.DropColumn(
                name: "MerchantAddress_FullAddress",
                table: "Receipts");

            migrationBuilder.DropColumn(
                name: "MerchantAddress_FullAddressConfidence",
                table: "Receipts");

            migrationBuilder.DropColumn(
                name: "MerchantAddress_HouseNumber",
                table: "Receipts");

            migrationBuilder.DropColumn(
                name: "MerchantAddress_HouseNumberConfidence",
                table: "Receipts");

            migrationBuilder.DropColumn(
                name: "MerchantAddress_PostalCode",
                table: "Receipts");

            migrationBuilder.DropColumn(
                name: "MerchantAddress_PostalCodeConfidence",
                table: "Receipts");

            migrationBuilder.DropColumn(
                name: "MerchantAddress_Road",
                table: "Receipts");

            migrationBuilder.DropColumn(
                name: "MerchantAddress_RoadConfidence",
                table: "Receipts");

            migrationBuilder.DropColumn(
                name: "MerchantAddress_StreetAddress",
                table: "Receipts");

            migrationBuilder.DropColumn(
                name: "MerchantAddress_StreetAddressConfidence",
                table: "Receipts");

            migrationBuilder.DropColumn(
                name: "ReceiptType",
                table: "Receipts");

            migrationBuilder.DropColumn(
                name: "ReceiptTypeConfidence",
                table: "Receipts");

            migrationBuilder.DropColumn(
                name: "TotalTax",
                table: "Receipts");

            migrationBuilder.DropColumn(
                name: "TotalTaxConfidence",
                table: "Receipts");

            migrationBuilder.DropColumn(
                name: "TotalTaxCurrency",
                table: "Receipts");

            migrationBuilder.DropColumn(
                name: "TransactionTime",
                table: "Receipts");

            migrationBuilder.DropColumn(
                name: "TransactionTimeConfidence",
                table: "Receipts");
        }
    }
}

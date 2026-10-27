using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TeaApp.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddAmountPerHundred : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "amountPerHundred",
                table: "BrewingMethodTable",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "amountPerHundred",
                table: "BrewingMethodTable");
        }
    }
}

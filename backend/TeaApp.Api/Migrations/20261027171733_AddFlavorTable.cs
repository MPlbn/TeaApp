using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace TeaApp.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddFlavorTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BrewingMethodTable_TeaTable_teaId",
                table: "BrewingMethodTable");

            migrationBuilder.DropForeignKey(
                name: "FK_TeaReviewTable_TeaTable_teaId",
                table: "TeaReviewTable");

            migrationBuilder.RenameColumn(
                name: "type",
                table: "TeaTable",
                newName: "Type");

            migrationBuilder.RenameColumn(
                name: "shop",
                table: "TeaTable",
                newName: "Shop");

            migrationBuilder.RenameColumn(
                name: "price",
                table: "TeaTable",
                newName: "Price");

            migrationBuilder.RenameColumn(
                name: "origin",
                table: "TeaTable",
                newName: "Origin");

            migrationBuilder.RenameColumn(
                name: "name",
                table: "TeaTable",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "description",
                table: "TeaTable",
                newName: "Description");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "TeaTable",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "userId",
                table: "TeaReviewTable",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "teaId",
                table: "TeaReviewTable",
                newName: "TeaId");

            migrationBuilder.RenameColumn(
                name: "review",
                table: "TeaReviewTable",
                newName: "Review");

            migrationBuilder.RenameColumn(
                name: "rating",
                table: "TeaReviewTable",
                newName: "Rating");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "TeaReviewTable",
                newName: "Id");

            migrationBuilder.RenameIndex(
                name: "IX_TeaReviewTable_teaId",
                table: "TeaReviewTable",
                newName: "IX_TeaReviewTable_TeaId");

            migrationBuilder.RenameColumn(
                name: "temperature",
                table: "BrewingMethodTable",
                newName: "Temperature");

            migrationBuilder.RenameColumn(
                name: "teaId",
                table: "BrewingMethodTable",
                newName: "TeaId");

            migrationBuilder.RenameColumn(
                name: "method",
                table: "BrewingMethodTable",
                newName: "Method");

            migrationBuilder.RenameColumn(
                name: "gongfuBrewingTimeIncrement",
                table: "BrewingMethodTable",
                newName: "GongfuBrewingTimeIncrement");

            migrationBuilder.RenameColumn(
                name: "brewingTimes",
                table: "BrewingMethodTable",
                newName: "BrewingTimes");

            migrationBuilder.RenameColumn(
                name: "amountPerHundred",
                table: "BrewingMethodTable",
                newName: "AmountPerHundred");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "BrewingMethodTable",
                newName: "Id");

            migrationBuilder.RenameIndex(
                name: "IX_BrewingMethodTable_teaId",
                table: "BrewingMethodTable",
                newName: "IX_BrewingMethodTable_TeaId");

            migrationBuilder.CreateTable(
                name: "FlavorTable",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TeaId = table.Column<int>(type: "integer", nullable: false),
                    FlavorType = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FlavorTable", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FlavorTable_TeaTable_TeaId",
                        column: x => x.TeaId,
                        principalTable: "TeaTable",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FlavorTable_TeaId",
                table: "FlavorTable",
                column: "TeaId");

            migrationBuilder.AddForeignKey(
                name: "FK_BrewingMethodTable_TeaTable_TeaId",
                table: "BrewingMethodTable",
                column: "TeaId",
                principalTable: "TeaTable",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TeaReviewTable_TeaTable_TeaId",
                table: "TeaReviewTable",
                column: "TeaId",
                principalTable: "TeaTable",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BrewingMethodTable_TeaTable_TeaId",
                table: "BrewingMethodTable");

            migrationBuilder.DropForeignKey(
                name: "FK_TeaReviewTable_TeaTable_TeaId",
                table: "TeaReviewTable");

            migrationBuilder.DropTable(
                name: "FlavorTable");

            migrationBuilder.RenameColumn(
                name: "Type",
                table: "TeaTable",
                newName: "type");

            migrationBuilder.RenameColumn(
                name: "Shop",
                table: "TeaTable",
                newName: "shop");

            migrationBuilder.RenameColumn(
                name: "Price",
                table: "TeaTable",
                newName: "price");

            migrationBuilder.RenameColumn(
                name: "Origin",
                table: "TeaTable",
                newName: "origin");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "TeaTable",
                newName: "name");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "TeaTable",
                newName: "description");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "TeaTable",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "TeaReviewTable",
                newName: "userId");

            migrationBuilder.RenameColumn(
                name: "TeaId",
                table: "TeaReviewTable",
                newName: "teaId");

            migrationBuilder.RenameColumn(
                name: "Review",
                table: "TeaReviewTable",
                newName: "review");

            migrationBuilder.RenameColumn(
                name: "Rating",
                table: "TeaReviewTable",
                newName: "rating");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "TeaReviewTable",
                newName: "id");

            migrationBuilder.RenameIndex(
                name: "IX_TeaReviewTable_TeaId",
                table: "TeaReviewTable",
                newName: "IX_TeaReviewTable_teaId");

            migrationBuilder.RenameColumn(
                name: "Temperature",
                table: "BrewingMethodTable",
                newName: "temperature");

            migrationBuilder.RenameColumn(
                name: "TeaId",
                table: "BrewingMethodTable",
                newName: "teaId");

            migrationBuilder.RenameColumn(
                name: "Method",
                table: "BrewingMethodTable",
                newName: "method");

            migrationBuilder.RenameColumn(
                name: "GongfuBrewingTimeIncrement",
                table: "BrewingMethodTable",
                newName: "gongfuBrewingTimeIncrement");

            migrationBuilder.RenameColumn(
                name: "BrewingTimes",
                table: "BrewingMethodTable",
                newName: "brewingTimes");

            migrationBuilder.RenameColumn(
                name: "AmountPerHundred",
                table: "BrewingMethodTable",
                newName: "amountPerHundred");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "BrewingMethodTable",
                newName: "id");

            migrationBuilder.RenameIndex(
                name: "IX_BrewingMethodTable_TeaId",
                table: "BrewingMethodTable",
                newName: "IX_BrewingMethodTable_teaId");

            migrationBuilder.AddForeignKey(
                name: "FK_BrewingMethodTable_TeaTable_teaId",
                table: "BrewingMethodTable",
                column: "teaId",
                principalTable: "TeaTable",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TeaReviewTable_TeaTable_teaId",
                table: "TeaReviewTable",
                column: "teaId",
                principalTable: "TeaTable",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}

using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TeaApp.Api.Migrations
{
    /// <inheritdoc />
    public partial class RenameModelProperties : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BrewingMethodTable_TeaTable_TeaId",
                table: "BrewingMethodTable");

            migrationBuilder.DropForeignKey(
                name: "FK_TeaReviewTable_TeaTable_TeaId",
                table: "TeaReviewTable");

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
                name: "ID",
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
                name: "ID",
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
                name: "ID",
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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
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
                newName: "ID");

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
                newName: "ID");

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
                name: "id",
                table: "BrewingMethodTable",
                newName: "ID");

            migrationBuilder.RenameIndex(
                name: "IX_BrewingMethodTable_teaId",
                table: "BrewingMethodTable",
                newName: "IX_BrewingMethodTable_TeaId");

            migrationBuilder.AddForeignKey(
                name: "FK_BrewingMethodTable_TeaTable_TeaId",
                table: "BrewingMethodTable",
                column: "TeaId",
                principalTable: "TeaTable",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TeaReviewTable_TeaTable_TeaId",
                table: "TeaReviewTable",
                column: "TeaId",
                principalTable: "TeaTable",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}

using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TeaApp.Api.Migrations
{
    /// <inheritdoc />
    public partial class ReviewsWithUserChange : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_TeaReviewTable_TeaId",
                table: "TeaReviewTable");

            migrationBuilder.CreateIndex(
                name: "IX_TeaReviewTable_TeaId_UserId",
                table: "TeaReviewTable",
                columns: new[] { "TeaId", "UserId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TeaReviewTable_UserId",
                table: "TeaReviewTable",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_TeaReviewTable_AspNetUsers_UserId",
                table: "TeaReviewTable",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TeaReviewTable_AspNetUsers_UserId",
                table: "TeaReviewTable");

            migrationBuilder.DropIndex(
                name: "IX_TeaReviewTable_TeaId_UserId",
                table: "TeaReviewTable");

            migrationBuilder.DropIndex(
                name: "IX_TeaReviewTable_UserId",
                table: "TeaReviewTable");

            migrationBuilder.CreateIndex(
                name: "IX_TeaReviewTable_TeaId",
                table: "TeaReviewTable",
                column: "TeaId");
        }
    }
}

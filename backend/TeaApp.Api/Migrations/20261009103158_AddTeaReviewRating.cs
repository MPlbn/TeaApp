using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TeaApp.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddTeaReviewRating : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Rating",
                table: "TeaReviewTable",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Rating",
                table: "TeaReviewTable");
        }
    }
}

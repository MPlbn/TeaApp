using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TeaApp.Api.Migrations
{
    /// <inheritdoc />
    public partial class ChangeToRequestDelete : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RequestSet_AspNetUsers_OwnerId",
                table: "RequestSet");

            migrationBuilder.AddForeignKey(
                name: "FK_RequestSet_AspNetUsers_OwnerId",
                table: "RequestSet",
                column: "OwnerId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RequestSet_AspNetUsers_OwnerId",
                table: "RequestSet");

            migrationBuilder.AddForeignKey(
                name: "FK_RequestSet_AspNetUsers_OwnerId",
                table: "RequestSet",
                column: "OwnerId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}

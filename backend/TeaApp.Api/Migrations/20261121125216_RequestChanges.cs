using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace TeaApp.Api.Migrations
{
    /// <inheritdoc />
    public partial class RequestChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "PublishRequestTable");

            migrationBuilder.DropColumn(
                name: "ResolutionMessage",
                table: "PublishRequestTable");

            migrationBuilder.DropColumn(
                name: "ResolvedAt",
                table: "PublishRequestTable");

            migrationBuilder.DropColumn(
                name: "ResolvingAdminId",
                table: "PublishRequestTable");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "PublishRequestTable");

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "PublishRequestTable",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer")
                .OldAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.CreateTable(
                name: "RequestSet",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    OwnerId = table.Column<string>(type: "text", nullable: false),
                    ResolvingAdminId = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ResolvedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ResolutionMessage = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RequestSet", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RequestSet_AspNetUsers_OwnerId",
                        column: x => x.OwnerId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_RequestSet_AspNetUsers_ResolvingAdminId",
                        column: x => x.ResolvingAdminId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_RequestSet_OwnerId",
                table: "RequestSet",
                column: "OwnerId");

            migrationBuilder.CreateIndex(
                name: "IX_RequestSet_ResolvingAdminId",
                table: "RequestSet",
                column: "ResolvingAdminId");

            migrationBuilder.AddForeignKey(
                name: "FK_PublishRequestTable_RequestSet_Id",
                table: "PublishRequestTable",
                column: "Id",
                principalTable: "RequestSet",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PublishRequestTable_RequestSet_Id",
                table: "PublishRequestTable");

            migrationBuilder.DropTable(
                name: "RequestSet");

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "PublishRequestTable",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer")
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "PublishRequestTable",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "ResolutionMessage",
                table: "PublishRequestTable",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ResolvedAt",
                table: "PublishRequestTable",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ResolvingAdminId",
                table: "PublishRequestTable",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "PublishRequestTable",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }
    }
}

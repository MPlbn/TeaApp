using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace TeaApp.Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TeaTable",
                columns: table => new
                {
                    ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    Origin = table.Column<string>(type: "text", nullable: false),
                    Shop = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TeaTable", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "BrewingMethodTable",
                columns: table => new
                {
                    ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TeaId = table.Column<int>(type: "integer", nullable: false),
                    Method = table.Column<int>(type: "integer", nullable: false),
                    Temperature = table.Column<int>(type: "integer", nullable: false),
                    BrewingTimes = table.Column<string>(type: "jsonb", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BrewingMethodTable", x => x.ID);
                    table.ForeignKey(
                        name: "FK_BrewingMethodTable_TeaTable_TeaId",
                        column: x => x.TeaId,
                        principalTable: "TeaTable",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TeaReviewTable",
                columns: table => new
                {
                    ID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TeaId = table.Column<int>(type: "integer", nullable: false),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    Review = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TeaReviewTable", x => x.ID);
                    table.ForeignKey(
                        name: "FK_TeaReviewTable_TeaTable_TeaId",
                        column: x => x.TeaId,
                        principalTable: "TeaTable",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BrewingMethodTable_TeaId",
                table: "BrewingMethodTable",
                column: "TeaId");

            migrationBuilder.CreateIndex(
                name: "IX_TeaReviewTable_TeaId",
                table: "TeaReviewTable",
                column: "TeaId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BrewingMethodTable");

            migrationBuilder.DropTable(
                name: "TeaReviewTable");

            migrationBuilder.DropTable(
                name: "TeaTable");
        }
    }
}

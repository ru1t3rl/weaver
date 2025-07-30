using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Weaver.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddServicEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Services",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TemplateId = table.Column<long>(type: "bigint", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Uuid = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Services", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Services_ServiceTemplates_TemplateId",
                        column: x => x.TemplateId,
                        principalTable: "ServiceTemplates",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ServiceOptions",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    ServiceId = table.Column<long>(type: "bigint", nullable: true),
                    Value = table.Column<bool>(type: "boolean", nullable: true),
                    ServiceOption_Value = table.Column<double>(type: "double precision", nullable: true),
                    ServiceOption_Value1 = table.Column<double[]>(type: "double precision[]", nullable: true),
                    ServiceOption_Value2 = table.Column<string>(type: "text", nullable: true),
                    ServiceOption_Value3 = table.Column<string[]>(type: "text[]", nullable: true),
                    Uuid = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ServiceOptions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ServiceOptions_Services_ServiceId",
                        column: x => x.ServiceId,
                        principalTable: "Services",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_ServiceOptions_ServiceId",
                table: "ServiceOptions",
                column: "ServiceId");

            migrationBuilder.CreateIndex(
                name: "IX_Services_TemplateId",
                table: "Services",
                column: "TemplateId");

            migrationBuilder.CreateIndex(
                name: "IX_Services_Uuid",
                table: "Services",
                column: "Uuid",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ServiceOptions");

            migrationBuilder.DropTable(
                name: "Services");
        }
    }
}

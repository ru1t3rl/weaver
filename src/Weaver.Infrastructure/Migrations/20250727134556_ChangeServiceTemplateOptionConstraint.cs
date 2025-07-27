using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Weaver.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ChangeServiceTemplateOptionConstraint : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_ServiceTemplateOptions_Name",
                table: "ServiceTemplateOptions");

            migrationBuilder.CreateIndex(
                name: "IX_ServiceTemplateOptions_Name_Type",
                table: "ServiceTemplateOptions",
                columns: new[] { "Name", "Type" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_ServiceTemplateOptions_Name_Type",
                table: "ServiceTemplateOptions");

            migrationBuilder.CreateIndex(
                name: "IX_ServiceTemplateOptions_Name",
                table: "ServiceTemplateOptions",
                column: "Name",
                unique: true);
        }
    }
}

using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Lab56Api.Migrations
{
    public partial class dbUpdate1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Lat",
                table: "Lab56Items",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Lng",
                table: "Lab56Items",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "StreetNo",
                table: "Lab56Items",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Lat",
                table: "Lab56Items");

            migrationBuilder.DropColumn(
                name: "Lng",
                table: "Lab56Items");

            migrationBuilder.DropColumn(
                name: "StreetNo",
                table: "Lab56Items");
        }
    }
}

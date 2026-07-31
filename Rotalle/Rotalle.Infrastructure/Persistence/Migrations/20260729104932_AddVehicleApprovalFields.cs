using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Rotalle.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddVehicleApprovalFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ApprovalReason",
                table: "Vehicles",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ApprovalStatus",
                table: "Vehicles",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "ApprovalUpdatedAt",
                table: "Vehicles",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ApprovedBy",
                table: "Vehicles",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ApprovalReason",
                table: "Vehicles");

            migrationBuilder.DropColumn(
                name: "ApprovalStatus",
                table: "Vehicles");

            migrationBuilder.DropColumn(
                name: "ApprovalUpdatedAt",
                table: "Vehicles");

            migrationBuilder.DropColumn(
                name: "ApprovedBy",
                table: "Vehicles");
        }
    }
}

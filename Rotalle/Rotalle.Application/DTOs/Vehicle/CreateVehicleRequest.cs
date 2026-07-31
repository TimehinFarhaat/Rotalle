using Microsoft.AspNetCore.Http;
using Rotalle.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace Rotalle.Application.DTOs.Vehicle;

public class CreateVehicleRequest
{


    [Required]
    [StringLength(50)]
    public string Brand { get; set; } = string.Empty;

    [Required]
    [StringLength(50)]
    public string Model { get; set; } = string.Empty;

    [Range(1990, 2100)]
    public int Year { get; set; }

    [Range(typeof(decimal), "1", "1000000")]
    public decimal DailyRate { get; set; }

    [Range(1, 20)]
    public int Seats { get; set; }

    [StringLength(100)]
    public string Location { get; set; } = string.Empty;

    [StringLength(1000)]
    public string Description { get; set; } = string.Empty;
   
    public VehicleType VehicleType { get; set; }

    public TransmissionType Transmission { get; set; }

    public FuelType FuelType { get; set; }

    public List<IFormFile> Images { get; set; } = [];
}
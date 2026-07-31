using Rotalle.Domain.Enums;

namespace Rotalle.Application.DTOs.Vehicle;

public class VehicleSearchRequest
{
    public string? Search { get; set; }

    public string? Location { get; set; }

    public VehicleType? VehicleType { get; set; }

    public TransmissionType? Transmission { get; set; }

    public FuelType? FuelType { get; set; }

    public int? Seats { get; set; }

    public decimal? MinPrice { get; set; }

    public decimal? MaxPrice { get; set; }
}
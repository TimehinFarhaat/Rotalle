using Rotalle.Domain.Enums;

namespace Rotalle.Application.DTOs.Vehicle;

public class VehicleResponse
{
    public Guid Id { get; set; }

    public string ProviderId { get; set; } = string.Empty;

    public string ProviderName { get; set; } = string.Empty;

    public string Brand { get; set; } = string.Empty;

    public string Model { get; set; } = string.Empty;

    public int Year { get; set; }

    public VehicleType VehicleType { get; set; }

    public TransmissionType Transmission { get; set; }

    public FuelType FuelType { get; set; }

    public int Seats { get; set; }

    public decimal DailyRate { get; set; }

    public string Location { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public List<VehicleImageResponse> Images { get; set; }
    = [];


    public VehicleStatus Status { get; set; }

    public VehicleApprovalStatus ApprovalStatus { get; set; }

    public DateTime CreatedAt { get; set; }
}
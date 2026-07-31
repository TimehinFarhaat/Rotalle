using Rotalle.Application.DTOs.Vehicle;

public class ProviderDetailsResponse
{
    public string Id { get; set; } = "";

    public string FullName { get; set; } = "";

    public string Email { get; set; } = "";

    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; }

    public List<VehicleResponse> Vehicles { get; set; } = [];
}
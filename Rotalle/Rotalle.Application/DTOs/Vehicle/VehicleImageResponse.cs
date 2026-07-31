namespace Rotalle.Application.DTOs.Vehicle;

public class VehicleImageResponse
{
    public Guid Id { get; set; }

    public string Url { get; set; } = string.Empty;

    public bool IsPrimary { get; set; }
    public int DisplayOrder { get; set; }
}
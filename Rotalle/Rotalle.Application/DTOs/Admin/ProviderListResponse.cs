public class ProviderListResponse
{
    public string Id { get; set; } = "";

    public string FullName { get; set; } = "";

    public string Email { get; set; } = "";

    public bool IsActive { get; set; }

    public int VehicleCount { get; set; }

    public int PendingVehicles { get; set; }

    public int ApprovedVehicles { get; set; }
}
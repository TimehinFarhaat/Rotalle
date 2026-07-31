namespace Rotalle.Application.DTOs.Admin;

public class DashboardResponse
{
    public int TotalUsers { get; set; }

    public int TotalProviders { get; set; }

    public int TotalCustomers { get; set; }

    public int TotalVehicles { get; set; }

    public int PendingVehicles { get; set; }

    public int ApprovedVehicles { get; set; }

    public int RejectedVehicles { get; set; }

    public int SuspendedVehicles { get; set; }

    public int ActiveBookings { get; set; }

    public int CompletedBookings { get; set; }

    public int CancelledBookings { get; set; }
}
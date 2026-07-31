using Rotalle.Application.DTOs.Admin;
using Rotalle.Application.DTOs.Vehicle;

namespace Rotalle.Application.Interfaces;

public interface IAdminService
{
    // Dashboard
    Task<DashboardResponse> GetDashboardAsync();

    // Vehicles
    Task<List<VehicleResponse>> GetVehiclesAsync();

    Task<List<VehicleResponse>> GetPendingVehiclesAsync();

    Task<VehicleResponse?> GetVehicleAsync(Guid vehicleId);

    Task ApproveVehicleAsync(Guid vehicleId);

    Task RejectVehicleAsync(Guid vehicleId,VehicleApprovalRequest request);

    Task SuspendVehicleAsync(Guid vehicleId, VehicleApprovalRequest request);

    Task ReinstateVehicleAsync(Guid vehicleId);
    Task<List<ProviderListResponse>> GetProvidersAsync();

    Task<ProviderDetailsResponse?> GetProviderAsync(string providerId);

    Task ActivateProviderAsync(string providerId);

    Task SuspendProviderAsync(string providerId);

    Task<List<CustomerListResponse>> GetCustomersAsync();

    Task<CustomerDetailsResponse?> GetCustomerAsync(string customerId);

    Task ActivateCustomerAsync(string customerId);

    Task SuspendCustomerAsync(string customerId);

    Task<List<BookingResponse>> GetBookingsAsync();

    Task<BookingResponse?> GetBookingAsync( Guid bookingId);

    Task<BookingStatsResponse> GetBookingStatsAsync();
}
using Microsoft.EntityFrameworkCore;
using Rotalle.Application.DTOs.Admin;
using Rotalle.Application.DTOs.Vehicle;
using Rotalle.Application.Interfaces;
using Rotalle.Application.Mappings;
using Rotalle.Domain.Enums;

namespace Rotalle.Application.Services;

public class AdminService : IAdminService
{
    private readonly IUnitOfWork _unitOfWork;

    public AdminService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<List<VehicleResponse>> GetPendingVehiclesAsync()
    {
        var vehicles = await _unitOfWork.Vehicles
            .Include(v => v.Provider)
            .Include(v => v.Images)
            .AsNoTracking()
            .Where(v =>
                v.ApprovalStatus == VehicleApprovalStatus.Pending)
            .OrderBy(v => v.CreatedAt)
            .ToListAsync();

        return vehicles.ToResponseList();
    }
    public async Task<List<VehicleResponse>> GetVehiclesAsync()
    {
        var vehicles = await _unitOfWork.Vehicles
            .Include(v => v.Provider)
            .Include(v => v.Images)
            .AsNoTracking()
            .OrderByDescending(v => v.CreatedAt)
            .ToListAsync();

        return vehicles.ToResponseList();
    }

    public async Task<VehicleResponse?> GetVehicleAsync(Guid vehicleId)
    {
        var vehicle = await _unitOfWork.Vehicles
            .Include(v => v.Provider)
            .Include(v => v.Images)
            .AsNoTracking()
            .FirstOrDefaultAsync(v => v.Id == vehicleId);

        return vehicle?.ToResponse();
    }
    public async Task ApproveVehicleAsync(Guid vehicleId)
    {
        await UpdateApprovalStatus( vehicleId, VehicleApprovalStatus.Approved);
    }

    public async Task RejectVehicleAsync( Guid vehicleId, VehicleApprovalRequest request)
    {
        await UpdateApprovalStatus(
        vehicleId,
        VehicleApprovalStatus.Rejected);
    }

    public async Task SuspendVehicleAsync(Guid vehicleId,VehicleApprovalRequest request)
    {
        await UpdateApprovalStatus(
         vehicleId,
         VehicleApprovalStatus.Suspended);
    }

    public async Task ReinstateVehicleAsync(Guid vehicleId)
    {
        await UpdateApprovalStatus(
        vehicleId,
        VehicleApprovalStatus.Approved);
    }

    public async Task<DashboardResponse> GetDashboardAsync()
    {
        var response = new DashboardResponse
        {
            TotalUsers = await _unitOfWork.Users.CountAsync(),

            TotalProviders = await _unitOfWork.Users.CountAsync(u =>
                u.Role == UserRole.Provider),

            TotalCustomers = await _unitOfWork.Users.CountAsync(u =>
                u.Role == UserRole.Customer),

            TotalVehicles = await _unitOfWork.Vehicles.CountAsync(),

            PendingVehicles = await _unitOfWork.Vehicles.CountAsync(v =>
                v.ApprovalStatus == VehicleApprovalStatus.Pending),

            ApprovedVehicles = await _unitOfWork.Vehicles.CountAsync(v =>
                v.ApprovalStatus == VehicleApprovalStatus.Approved),

            RejectedVehicles = await _unitOfWork.Vehicles.CountAsync(v =>
                v.ApprovalStatus == VehicleApprovalStatus.Rejected),

            SuspendedVehicles = await _unitOfWork.Vehicles.CountAsync(v =>
                v.ApprovalStatus == VehicleApprovalStatus.Suspended),

            ActiveBookings = await _unitOfWork.Bookings.CountAsync(b =>
               b.Status == BookingStatus.Active),

            CompletedBookings = await _unitOfWork.Bookings.CountAsync(b =>
                b.Status == BookingStatus.Completed),

            CancelledBookings = await _unitOfWork.Bookings.CountAsync(b =>
             b.Status == BookingStatus.Cancelled)
        };

        return response;
    }

    public async Task ActivateProviderAsync(string providerId)
    {
        var provider = await _unitOfWork.Users
            .FirstOrDefaultAsync(u =>
                u.Id == providerId &&
                u.Role == UserRole.Provider);

        if (provider is null)
            throw new KeyNotFoundException("Provider not found.");

        if (provider.IsActive)
            return;

        provider.IsActive = true;

        await _unitOfWork.SaveChangesAsync();
    }

    public async Task SuspendProviderAsync(string providerId)
    {
        var provider = await _unitOfWork.Users
            .FirstOrDefaultAsync(u =>
                u.Id == providerId &&
                u.Role == UserRole.Provider);

        if (provider is null)
            throw new KeyNotFoundException("Provider not found.");

        if (!provider.IsActive)
            return;

        provider.IsActive = false;

        await _unitOfWork.SaveChangesAsync();
    }

    public async Task<List<ProviderListResponse>> GetProvidersAsync()
    {
        return await _unitOfWork.Users
            .Where(u => u.Role == UserRole.Provider)
            .Select(u => new ProviderListResponse
            {
                Id = u.Id,

                FullName = u.FullName,

                Email = u.Email!,

                IsActive = u.IsActive,

                VehicleCount = u.Vehicles.Count,

                PendingVehicles = u.Vehicles.Count(v =>
                    v.ApprovalStatus == VehicleApprovalStatus.Pending),

                ApprovedVehicles = u.Vehicles.Count(v =>
                    v.ApprovalStatus == VehicleApprovalStatus.Approved)
            })
            .OrderBy(p => p.FullName)
            .ToListAsync();
    }

    public async Task<ProviderDetailsResponse?> GetProviderAsync(string providerId)
    {
        var provider = await _unitOfWork.Users
            .Include(u => u.Vehicles)
                .ThenInclude(v => v.Images)
            .FirstOrDefaultAsync(u =>
                u.Id == providerId &&
                u.Role == UserRole.Provider);

        if (provider is null)
            return null;

        return new ProviderDetailsResponse
        {
            Id = provider.Id,

            FullName = provider.FullName,

            Email = provider.Email!,

            IsActive = provider.IsActive,

            CreatedAt = provider.CreatedAt,

            Vehicles = provider.Vehicles
                .OrderByDescending(v => v.CreatedAt)
                .Select(v => v.ToResponse())
                .ToList()
        };
    }

    public async Task<List<CustomerListResponse>> GetCustomersAsync()
    {
        return await _unitOfWork.Users
            .Where(u => u.Role == UserRole.Customer)
            .OrderBy(u => u.FullName)
            .Select(u => new CustomerListResponse
            {
                Id = u.Id,

                FullName = u.FullName,

                Email = u.Email!,

                IsActive = u.IsActive,

                CreatedAt = u.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<CustomerDetailsResponse?> GetCustomerAsync(string customerId)
    {
        var customer = await _unitOfWork.Users
            .FirstOrDefaultAsync(u =>
                u.Id == customerId &&
                u.Role == UserRole.Customer);

        if (customer is null)
            return null;

        return new CustomerDetailsResponse
        {
            Id = customer.Id,

            FullName = customer.FullName,

            Email = customer.Email!,

            IsActive = customer.IsActive,

            CreatedAt = customer.CreatedAt
        };
    }

    public async Task ActivateCustomerAsync(string customerId)
    {
        var customer = await _unitOfWork.Users
            .FirstOrDefaultAsync(u =>
                u.Id == customerId &&
                u.Role == UserRole.Customer);

        if (customer is null)
            throw new KeyNotFoundException("Customer not found.");

        if (customer.IsActive)
            return;

        customer.IsActive = true;

        await _unitOfWork.SaveChangesAsync();
    }

    public async Task SuspendCustomerAsync(string customerId)
    {
        var customer = await _unitOfWork.Users
            .FirstOrDefaultAsync(u =>
                u.Id == customerId &&
                u.Role == UserRole.Customer);

        if (customer is null)
            throw new KeyNotFoundException("Customer not found.");

        if (!customer.IsActive)
            return;

        customer.IsActive = false;

        await _unitOfWork.SaveChangesAsync();
    }

    public async Task<List<BookingResponse>> GetBookingsAsync()
    {
        var bookings = await _unitOfWork.Bookings
            .Include(b => b.Vehicle)
            .Include(b => b.Customer)
            .OrderByDescending(b => b.CreatedAt)
            .ToListAsync();

        return bookings.ToResponseList();
    }

    public async Task<BookingResponse?> GetBookingAsync( Guid bookingId)
    {
        var booking = await _unitOfWork.Bookings
            .Include(b => b.Vehicle)
            .Include(b => b.Customer)
            .FirstOrDefaultAsync(b =>
                b.Id == bookingId);

        return booking?.ToResponse();
    }


    public async Task<BookingStatsResponse>GetBookingStatsAsync()
    {
        var bookings =
            await _unitOfWork.Bookings
                .ToListAsync();

        return new BookingStatsResponse
        {
            TotalBookings =
                bookings.Count,

            PendingBookings =
                bookings.Count(b =>
                    b.Status == BookingStatus.Pending),

            ApprovedBookings =
                bookings.Count(b =>
                    b.Status == BookingStatus.Approved),

            ActiveBookings =
                bookings.Count(b =>
                    b.Status == BookingStatus.Active),

            CompletedBookings =
                bookings.Count(b =>
                    b.Status == BookingStatus.Completed),

            CancelledBookings =
                bookings.Count(b =>
                    b.Status == BookingStatus.Cancelled),

            RejectedBookings =
                bookings.Count(b =>
                    b.Status == BookingStatus.Rejected),

            TotalRevenue =
                bookings
                    .Where(b =>
                        b.Status ==
                        BookingStatus.Completed)
                    .Sum(b =>
                        b.TotalAmount)
        };
    }
    private async Task UpdateApprovalStatus(Guid vehicleId, VehicleApprovalStatus status,string? reason = null,
    string? adminId = null)
    {
        var vehicle = await _unitOfWork.Vehicles
            .FirstOrDefaultAsync(v => v.Id == vehicleId);

        if (vehicle is null)
            throw new KeyNotFoundException("Vehicle not found.");

        vehicle.ApprovalStatus = status;
        vehicle.ApprovalReason = reason;
        vehicle.ApprovalUpdatedAt = DateTime.UtcNow;
        vehicle.ApprovedBy = adminId;

        await _unitOfWork.SaveChangesAsync();
    }
}
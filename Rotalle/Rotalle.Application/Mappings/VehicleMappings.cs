using Rotalle.Application.DTOs.Vehicle;
using Rotalle.Domain.Entities;

namespace Rotalle.Application.Mappings;

public static class VehicleMappings
{
    public static VehicleResponse ToResponse(  this Vehicle vehicle)
    {
        return new VehicleResponse
        {
            Id = vehicle.Id,

            ProviderId = vehicle.ProviderId,

            ProviderName = vehicle.Provider?.FullName ?? string.Empty,

            Brand = vehicle.Brand,

            Model = vehicle.Model,

            Year = vehicle.Year,

            VehicleType = vehicle.VehicleType,

            Transmission = vehicle.Transmission,

            FuelType = vehicle.FuelType,

            Seats = vehicle.Seats,

            DailyRate = vehicle.DailyRate,

            Location = vehicle.Location,

            Description = vehicle.Description,

            Images = vehicle.Images.OrderBy(i => i.DisplayOrder).Select(i => i.ToResponse()).ToList(),

            ApprovalStatus=vehicle.ApprovalStatus,

            Status = vehicle.Status,

            CreatedAt = vehicle.CreatedAt
        };
    }

    public static List<VehicleResponse> ToResponseList(this IEnumerable<Vehicle> vehicles)
    {
        return vehicles
            .Select(v => v.ToResponse())
            .ToList();
    }
}
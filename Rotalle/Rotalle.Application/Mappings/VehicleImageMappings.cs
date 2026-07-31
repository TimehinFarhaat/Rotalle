using Rotalle.Application.DTOs.Vehicle;
using Rotalle.Domain.Entities;

namespace Rotalle.Application.Mappings;

public static class VehicleImageMappings
{
    public static VehicleImageResponse ToResponse(
        this VehicleImage image)
    {
        return new VehicleImageResponse
        {
            Id = image.Id,

            Url = image.Url,

            IsPrimary = image.IsPrimary,

            DisplayOrder = image.DisplayOrder
        };
    }
}
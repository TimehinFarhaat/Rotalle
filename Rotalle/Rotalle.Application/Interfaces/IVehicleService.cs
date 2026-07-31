using Microsoft.AspNetCore.Http;
using Rotalle.Application.DTOs.Vehicle;

namespace Rotalle.Application.Interfaces;

public interface IVehicleService
{
    Task<VehicleResponse> CreateAsync(string providerId,CreateVehicleRequest request);

    Task<VehicleResponse> UpdateAsync(Guid vehicleId,string providerId,UpdateVehicleRequest request);

    Task DeleteAsync(Guid vehicleId, string providerId);

    Task<VehicleResponse?> GetPublicVehicleAsync(Guid vehicleId);

    Task<List<VehicleResponse>> GetPublicVehicles();
    Task<VehicleResponse?> GetProviderVehicleAsync(Guid id,string providerId);

    Task<List<VehicleResponse>> GetProviderVehiclesAsync( string providerId);

    Task<List<VehicleResponse>> SearchAsync(VehicleSearchRequest request);

    Task<VehicleResponse> AddImagesAsync(Guid vehicleId,string providerId,IEnumerable<IFormFile> images);

    Task DeleteImageAsync(Guid vehicleId, Guid imageId, string providerId);

    Task SetPrimaryImageAsync(Guid vehicleId,Guid imageId, string providerId);
}
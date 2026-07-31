using Microsoft.AspNetCore.Http;
using Rotalle.Application.DTOs.Common;

public interface IImageService
{
    Task<List<UploadedImageResponse>> UploadVehicleImagesAsync( IEnumerable<IFormFile> files, string providerId);

    Task DeleteVehicleImagesAsync(IEnumerable<string> publicIds);
}
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Rotalle.Application.DTOs.Common;
using Rotalle.Application.DTOs.Vehicle;
using Rotalle.Application.Interfaces;
using Rotalle.Application.Mappings;
using Rotalle.Domain.Entities;
using Rotalle.Domain.Enums;

namespace Rotalle.Application.Services;

public class VehicleService : IVehicleService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IImageService _imageService;

    public VehicleService(IUnitOfWork unitOfWork,IImageService imageService)
    {
        _unitOfWork = unitOfWork;
        _imageService = imageService;
    }

    public async Task<VehicleResponse> CreateAsync( string providerId, CreateVehicleRequest request)
    {
        var vehicle = new Vehicle
        {
            ProviderId = providerId,
            Brand = request.Brand,
            Model = request.Model,
            Year = request.Year,
            VehicleType = request.VehicleType,
            Transmission = request.Transmission,
            FuelType = request.FuelType,
            Seats = request.Seats,
            DailyRate = request.DailyRate,
            Location = request.Location,
            Description = request.Description,
            Status = VehicleStatus.Available,
            ApprovalStatus =VehicleApprovalStatus.Pending
        };

        List<UploadedImageResponse> uploadedImages = [];

        try
        {
            uploadedImages =
                await _imageService.UploadVehicleImagesAsync(
                    request.Images,
                    providerId);

            vehicle.Images = uploadedImages
                .Select((image, index) => new VehicleImage
                {
                    PublicId = image.PublicId,
                    Url = image.Url,
                    DisplayOrder = index,
                    IsPrimary = index == 0
                })
                .ToList();

            await _unitOfWork.Vehicles.AddAsync(vehicle);

            await _unitOfWork.SaveChangesAsync();

            var createdVehicle =
                await _unitOfWork.Vehicles
                    .Include(v => v.Provider)
                    .Include(v => v.Images)
                    .FirstAsync(v => v.Id == vehicle.Id);

            return createdVehicle.ToResponse();
        }
        catch
        {
            if (uploadedImages.Any())
            {
                await _imageService.DeleteVehicleImagesAsync(
                    uploadedImages.Select(i => i.PublicId));
            }

            throw;
        }
    }

    public async Task<VehicleResponse> UpdateAsync( Guid vehicleId, string providerId, UpdateVehicleRequest request)
    {
        var vehicle = await _unitOfWork.Vehicles.FirstOrDefaultAsync(v => v.Id == vehicleId);

        if (vehicle is null) throw new KeyNotFoundException(  "Vehicle not found." );
       

        if (vehicle.ProviderId != providerId)  throw new UnauthorizedAccessException( "You can only edit your own vehicles.");
    

        UpdateVehicle(vehicle,request  );

       

        await _unitOfWork.SaveChangesAsync();
        return vehicle.ToResponse();
    }

    public async Task DeleteAsync(Guid vehicleId,string providerId)
    {
        var vehicle = await _unitOfWork.Vehicles
            .FirstOrDefaultAsync(v =>
                v.Id == vehicleId);

        if (vehicle is null)
            throw new KeyNotFoundException(
                "Vehicle not found.");

        if (vehicle.ProviderId != providerId)
            throw new UnauthorizedAccessException(
                "You can only delete your own vehicles.");

        vehicle.Status = VehicleStatus.Inactive;

        await _unitOfWork.SaveChangesAsync();
    }

    public async Task<List<VehicleResponse>> GetPublicVehicles()
    {


        var vehicles = await _unitOfWork.Vehicles
            .Where(v =>
               v.Status != VehicleStatus.Inactive && v.ApprovalStatus == VehicleApprovalStatus.Approved)
            .Include(v => v.Provider)
            .Include(v => v.Images)
            .AsNoTracking()
            .OrderByDescending(v => v.CreatedAt)
            .ToListAsync();

        return vehicles.ToResponseList();
        
    }

    public async Task<List<VehicleResponse>> SearchAsync(  VehicleSearchRequest request)
    {
        IQueryable<Vehicle> query = _unitOfWork.Vehicles
            .Include(v => v.Provider)
            .Include(v => v.Images)
            .AsNoTracking()
            .Where(v => v.Status != VehicleStatus.Inactive && v.ApprovalStatus ==VehicleApprovalStatus.Approved);

        query = ApplySearch(query, request);

        var vehicles = await query
            .OrderByDescending(v => v.CreatedAt)
            .ToListAsync();

        return vehicles.ToResponseList();
    }

    public async Task<List<VehicleResponse>>GetProviderVehiclesAsync(string providerId)
    {
        var vehicles = await _unitOfWork.Vehicles
            .Where(v =>
                v.ProviderId == providerId)
            .Include(v => v.Provider)
            .Include(v => v.Images)
            .AsNoTracking()
            .OrderByDescending(v => v.CreatedAt)
            .ToListAsync();

        return vehicles.ToResponseList();
    }

    public async Task<VehicleResponse?> GetPublicVehicleAsync(Guid vehicleId)
    {
        var vehicle = await _unitOfWork.Vehicles
           .Include(v => v.Provider)
           .Include(v => v.Images)
           .AsNoTracking()
           .FirstOrDefaultAsync(v =>
               v.Id == vehicleId &&
               v.Status != VehicleStatus.Inactive && v.ApprovalStatus == VehicleApprovalStatus.Approved);

        if (vehicle is null)
            return null;

        return vehicle.ToResponse();

    }

    public async Task<VehicleResponse?> GetProviderVehicleAsync(Guid vehicleId, string providerId)
    {
        var vehicle = await _unitOfWork.Vehicles
        .Include(v => v.Provider)
        .AsNoTracking()
        .Include(v => v.Images)
        .FirstOrDefaultAsync(v =>
            v.Id == vehicleId &&
            v.ProviderId == providerId);

        return vehicle?.ToResponse();
    }




    public async Task DeleteImageAsync(Guid vehicleId, Guid imageId, string providerId)
    {
        var image = await _unitOfWork.VehicleImages .FirstOrDefaultAsync(i =>  i.Id == imageId && i.VehicleId == vehicleId);

        if (image is null)
            throw new KeyNotFoundException("Image not found.");

        var vehicle = await _unitOfWork.Vehicles
                .Include(v => v.Images)
                .FirstOrDefaultAsync(v =>
                    v.Id == vehicleId &&
                    v.ProviderId == providerId);

        if (vehicle is null)
            throw new KeyNotFoundException("Vehicle not found.");

        await _imageService.DeleteVehicleImagesAsync( new[] { image.PublicId });
     
        _unitOfWork.VehicleImages.Remove(image); 

         if (image.IsPrimary)  { 

            var nextPrimary = vehicle.Images .Where(i => i.Id != imageId) .OrderBy(i => i.DisplayOrder) .FirstOrDefault();
            if (nextPrimary is not null) 
            {
                nextPrimary.IsPrimary = true;
            } 
         }
        var remainingImages = vehicle.Images.Where(i => i.Id != imageId).OrderBy(i => i.DisplayOrder).ToList(); 
        for (int index = 0; index < remainingImages.Count; index++) 
        { 
            remainingImages[index].DisplayOrder = index;
        }

        await _unitOfWork.SaveChangesAsync();
    }


    public async Task<VehicleResponse> AddImagesAsync(Guid vehicleId, string providerId, IEnumerable<IFormFile> images)
    {
        // 1. Fetch only what is absolutely necessary (Drop .Include(v => v.Provider) to avoid tracker bloat)
        var vehicle = await _unitOfWork.Vehicles
            .Include(v => v.Images)
            .FirstOrDefaultAsync(v => v.Id == vehicleId && v.ProviderId == providerId);

        if (vehicle is null)
            throw new KeyNotFoundException("Vehicle not found.");

        if (!images.Any())
            throw new ArgumentException("No images supplied.");

        var uploaded = await _imageService.UploadVehicleImagesAsync(images, providerId);

        var displayOrder = vehicle.Images.Any()
            ? vehicle.Images.Max(i => i.DisplayOrder) + 1
            : 0;

        // 2. Add images directly to their own repository/DbSet instead of the vehicle's collection
        foreach (var image in uploaded)
        {
            var newImage = new VehicleImage
            {
                VehicleId = vehicle.Id,
                PublicId = image.PublicId,
                Url = image.Url,
                DisplayOrder = displayOrder++,
                IsPrimary = false
            };

            // Use your Unit of Work's specific repository for VehicleImages
            await _unitOfWork.VehicleImages.AddAsync(newImage);

            // Also keep local object graph updated for the final response mapping
            vehicle.Images.Add(newImage);
        }

        // 3. Save changes cleanly
        await _unitOfWork.SaveChangesAsync();

        return vehicle.ToResponse();
    }



    public async Task SetPrimaryImageAsync(Guid vehicleId,Guid imageId, string providerId)
    {
        var vehicle = await _unitOfWork.Vehicles
            .Include(v => v.Images)
            .FirstOrDefaultAsync(v =>
                v.Id == vehicleId &&
                v.ProviderId == providerId);

        if (vehicle is null)
            throw new KeyNotFoundException("Vehicle not found.");

        var image = vehicle.Images
            .FirstOrDefault(i => i.Id == imageId);

        if (image is null)
            throw new KeyNotFoundException("Image not found.");

        foreach (var img in vehicle.Images)
        {
            img.IsPrimary = false;
        }

        image.IsPrimary = true;

        await _unitOfWork.SaveChangesAsync();
    }
    private static IQueryable<Vehicle> ApplySearch(IQueryable<Vehicle> query,VehicleSearchRequest request)
    {
        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var search = request.Search.Trim().ToLower();

            query = query.Where(v =>
                        v.Brand.ToLower().Contains(search) ||
                        v.Model.ToLower().Contains(search));


        }

        if (!string.IsNullOrWhiteSpace(request.Location))
        {
            var location = request.Location.Trim().ToLower();

            query = query.Where(v =>
                      v.Location.ToLower().Contains(location));
        }

        if (request.VehicleType.HasValue)
        {
            query = query.Where(v =>
                v.VehicleType == request.VehicleType.Value);
        }

        if (request.Transmission.HasValue)
        {
            query = query.Where(v =>
                v.Transmission == request.Transmission.Value);
        }

        if (request.FuelType.HasValue)
        {
            query = query.Where(v =>
                v.FuelType == request.FuelType.Value);
        }

        if (request.Seats.HasValue)
        {
            query = query.Where(v =>
                v.Seats >= request.Seats.Value);
        }

        if (request.MinPrice.HasValue)
        {
            query = query.Where(v =>
                v.DailyRate >= request.MinPrice.Value);
        }

        if (request.MaxPrice.HasValue)
        {
            query = query.Where(v =>
                v.DailyRate <= request.MaxPrice.Value);
        }

        return query;
    }

    private static void UpdateVehicle(Vehicle vehicle,UpdateVehicleRequest request)
    {
        vehicle.Brand = request.Brand;

        vehicle.Model = request.Model;

        vehicle.Year = request.Year;

        vehicle.VehicleType = request.VehicleType;

        vehicle.Transmission = request.Transmission;

        vehicle.FuelType = request.FuelType;

        vehicle.Seats = request.Seats;

        vehicle.DailyRate = request.DailyRate;

        vehicle.Location = request.Location;

        vehicle.Description = request.Description;

        vehicle.Status = request.Status;

         
    }

    

    


}
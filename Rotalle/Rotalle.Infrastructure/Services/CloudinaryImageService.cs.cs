using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Rotalle.Application.Constants;
using Rotalle.Application.DTOs.Common;
using Rotalle.Application.Interfaces;
using Rotalle.Infrastructure.Configuration;

namespace Rotalle.Infrastructure.Services;

public class CloudinaryImageService : IImageService
{
    private readonly Cloudinary _cloudinary;

    public CloudinaryImageService(
        IOptions<CloudinarySettings> options)
    {
        var settings = options.Value;

        var account = new Account(
            settings.CloudName,
            settings.ApiKey,
            settings.ApiSecret);

        _cloudinary = new Cloudinary(account);

        _cloudinary.Api.Secure = true;
    }

    public async Task DeleteVehicleImagesAsync( IEnumerable<string> publicIds)
    {
        foreach (var publicId in publicIds)
        {
            var deleteParams =
                new DeletionParams(publicId);

            await _cloudinary.DestroyAsync(
                deleteParams);
        }
    }

    public async Task<List<UploadedImageResponse>>UploadVehicleImagesAsync( IEnumerable<IFormFile> files, string providerId)
    {
        ValidateImages(files);
        var uploadedImages =new List<UploadedImageResponse>();

        foreach (var file in files)
        {
            if (file.Length == 0)
                continue;

            await using var stream =
                file.OpenReadStream();

            var uploadParams =
                new ImageUploadParams
                {
                    File = new FileDescription(
                        file.FileName,
                        stream),

                    Folder = $"rotalle/providers/{providerId}/vehicles",

                    UseFilename = true,

                    UniqueFilename = true,

                    Overwrite = false
                };

            var result =
                await _cloudinary.UploadAsync(
                    uploadParams);

            if (result.Error != null)
            {
                throw new InvalidOperationException(
                    result.Error.Message);
            }

            uploadedImages.Add(
                new UploadedImageResponse
                {
                    PublicId = result.PublicId,

                    Url = result.SecureUrl.ToString()
                });
        }

        return uploadedImages;
    }


    private static void ValidateImages( IEnumerable<IFormFile> files)
    {
        var images = files.ToList();

        if (!images.Any())
        {
            throw new InvalidOperationException(
                "Please upload at least one image.");
        }

        if (images.Count > ImageConstants.MaxImages)
        {
            throw new InvalidOperationException(
                $"You can upload a maximum of {ImageConstants.MaxImages} images.");
        }

        foreach (var image in images)
        {
            ValidateImage(image);
        }
    }

    private static void ValidateImage( IFormFile image)
    {
        if (image.Length == 0)
        {
            throw new InvalidOperationException(
                "One of the uploaded images is empty.");
        }

        if (image.Length > ImageConstants.MaxImageSize)
        {
            throw new InvalidOperationException(
                $"Each image must be smaller than {ImageConstants.MaxImageSizeInMb} MB.");
        }

        if (!ImageConstants.AllowedContentTypes.Contains(
                image.ContentType))
        {
            throw new InvalidOperationException(
                "Only JPEG, PNG and WEBP images are allowed.");
        }
    }
}
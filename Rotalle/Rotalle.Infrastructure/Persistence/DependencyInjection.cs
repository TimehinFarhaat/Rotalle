using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Rotalle.Application.Interfaces;
using Rotalle.Application.Services;
using Rotalle.Infrastructure.Configuration;
using Rotalle.Infrastructure.Data;
using Rotalle.Infrastructure.Services;

namespace Rotalle.Infrastructure.Persistence;

public static class DependencyInjection
{
    public static IServiceCollection AddPersistence(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString(
            "DefaultConnection");
        services.Configure<CloudinarySettings>(configuration.GetSection(
       CloudinarySettings.SectionName));

        services.AddDbContext<ApplicationDbContext>(options =>
        {
            options.UseNpgsql(connectionString);
        });

        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped<IVehicleService,VehicleService>();
        services.AddScoped<IImageService, CloudinaryImageService>();
        services.AddScoped<IAdminService, AdminService>();
        services.AddScoped<IBookingService,BookingService>();





        return services;
    }
}
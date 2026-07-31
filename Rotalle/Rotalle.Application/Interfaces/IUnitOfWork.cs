using Microsoft.EntityFrameworkCore;
using Rotalle.Domain.Entities;

namespace Rotalle.Application.Interfaces;

public interface IUnitOfWork
{
    DbSet<ApplicationUser> Users { get; }

    DbSet<Vehicle> Vehicles { get; }

    DbSet<VehicleImage> VehicleImages { get; }

    DbSet<Booking> Bookings { get; }

    Task<int> SaveChangesAsync( CancellationToken cancellationToken = default);
}
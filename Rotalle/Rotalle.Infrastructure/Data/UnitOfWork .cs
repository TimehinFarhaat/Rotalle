using Microsoft.EntityFrameworkCore;
using Rotalle.Application.Interfaces;
using Rotalle.Domain.Entities;
using Rotalle.Infrastructure.Persistence;

namespace Rotalle.Infrastructure.Data;

public class UnitOfWork : IUnitOfWork
{
    private readonly ApplicationDbContext _context;

    public UnitOfWork( ApplicationDbContext context)
    {
        _context = context;
    }

    public DbSet<ApplicationUser> Users =>_context.Users;

    public DbSet<Vehicle> Vehicles =>  _context.Vehicles;
    public DbSet<VehicleImage> VehicleImages => _context.VehicleImages;
    public DbSet<Booking> Bookings => _context.Bookings;



    public Task<int> SaveChangesAsync( CancellationToken cancellationToken = default)
    {
        return _context.SaveChangesAsync( cancellationToken);
    }
}
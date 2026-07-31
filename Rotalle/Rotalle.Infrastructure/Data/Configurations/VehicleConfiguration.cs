using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Rotalle.Domain.Entities;

public class VehicleConfiguration
    : IEntityTypeConfiguration<Vehicle>
{
    public void Configure(
        EntityTypeBuilder<Vehicle> builder)
    {
        builder.HasKey(v => v.Id);

        builder.Property(v => v.Brand)
               .HasMaxLength(100)
               .IsRequired();

        builder.Property(v => v.Model)
               .HasMaxLength(100)
               .IsRequired();

        builder.Property(v => v.Location)
               .HasMaxLength(150)
               .IsRequired();

        builder.Property(v => v.Description)
               .HasMaxLength(2000);

        builder.Property(v => v.DailyRate)
               .HasPrecision(18, 2);

        builder.HasOne(v => v.Provider)
               .WithMany(u => u.Vehicles)
               .HasForeignKey(v => v.ProviderId)
               .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(v => v.Images)
               .WithOne(vi => vi.Vehicle)
               .HasForeignKey(vi => vi.VehicleId)
               .OnDelete(DeleteBehavior.Cascade);
    }
}
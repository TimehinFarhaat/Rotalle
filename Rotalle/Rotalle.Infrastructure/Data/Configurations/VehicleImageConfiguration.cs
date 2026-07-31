using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Rotalle.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Rotalle.Infrastructure.Data.Configurations
{
    public class VehicleImageConfiguration : IEntityTypeConfiguration<VehicleImage>
    {
        public void Configure(EntityTypeBuilder<VehicleImage> builder)
        {
            
            builder.ToTable("VehicleImages");

            builder.HasKey(vi => vi.Id);

            
            builder.Property(vi => vi.PublicId)
                .IsRequired()
                .HasMaxLength(255); 

            builder.Property(vi => vi.Url)
                .IsRequired()
                .HasMaxLength(2083); 

            builder.Property(vi => vi.IsPrimary)
                .HasDefaultValue(false);

            builder.Property(vi => vi.DisplayOrder)
                .HasDefaultValue(0);

            builder.Property(vi => vi.CreatedAt)
                .IsRequired();

            
            builder.HasOne(vi => vi.Vehicle)
                .WithMany(v => v.Images) 
                .HasForeignKey(vi => vi.VehicleId)
                .OnDelete(DeleteBehavior.Cascade); 
        }
    }
}

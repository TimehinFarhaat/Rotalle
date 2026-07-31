using Rotalle.Domain.Common;
using Rotalle.Domain.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Rotalle.Domain.Entities;

public class Vehicle: AuditableEntity
{
    
    public string ProviderId { get; set; } = string.Empty;

   
    public ApplicationUser Provider { get; set; } = null!;

    
    public string Brand { get; set; } = string.Empty;

   
    public string Model { get; set; } = string.Empty;

    public int Year { get; set; }

    public VehicleType VehicleType { get; set; }

    public TransmissionType Transmission { get; set; }

    public FuelType FuelType { get; set; }

    public int Seats { get; set; }

    
    public decimal DailyRate { get; set; }

    
    public string Location { get; set; } = string.Empty;

  
    public string Description { get; set; } = string.Empty;
    public string? ApprovalReason { get; set; }=string.Empty;
    public DateTime? ApprovalUpdatedAt { get; set; }

    public string? ApprovedBy { get; set; }
    public ICollection<VehicleImage> Images { get; set; }= new List<VehicleImage>();

    public VehicleStatus Status { get; set; } =VehicleStatus.Available;

    public VehicleApprovalStatus ApprovalStatus { get; set; }= VehicleApprovalStatus.Pending;
    public ICollection<Booking> Bookings
    = new List<Booking>();


}
using Rotalle.Domain.Common;
using Rotalle.Domain.Entities;

public class Booking : AuditableEntity
{
    public Guid VehicleId { get; set; }

    public Vehicle Vehicle { get; set; } = null!;

    public string CustomerId { get; set; } = string.Empty;

    public ApplicationUser Customer { get; set; } = null!;

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public int TotalDays { get; set; }

    public decimal DailyRate { get; set; }

    public decimal TotalAmount { get; set; }

    public BookingStatus Status { get; set; }
        = BookingStatus.Pending;

    public string? CancellationReason { get; set; }

    public DateTime? CancelledAt { get; set; } 

    public string? RejectionReason { get; set; }

    public DateTime? ApprovedAt { get; set; }

    public DateTime? PickedUpAt { get; set; }

    public DateTime? ReturnedAt { get; set; }
}
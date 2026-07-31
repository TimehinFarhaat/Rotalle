namespace Rotalle.Application.DTOs.Admin;

public class BookingStatsResponse
{
    public int TotalBookings { get; set; }

    public int PendingBookings { get; set; }

    public int ApprovedBookings { get; set; }

    public int ActiveBookings { get; set; }

    public int CompletedBookings { get; set; }

    public int CancelledBookings { get; set; }

    public int RejectedBookings { get; set; }

    public decimal TotalRevenue { get; set; }
}
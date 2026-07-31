public class BookingResponse
{
    public Guid Id { get; set; }

    public Guid VehicleId { get; set; }

    public string VehicleName { get; set; } = string.Empty;

    public string CustomerId { get; set; } = string.Empty;

    public string CustomerName { get; set; } = string.Empty;

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }
    public decimal DailyRate { get; set; }
    public int TotalDays { get; set; }

    public decimal TotalAmount { get; set; }

    public BookingStatus Status { get; set; }

    public DateTime CreatedAt { get; set; }
}
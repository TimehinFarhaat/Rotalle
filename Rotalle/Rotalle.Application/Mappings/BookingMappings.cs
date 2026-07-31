using Rotalle.Application.DTOs.Vehicle;
using Rotalle.Domain.Entities;

namespace Rotalle.Application.Mappings;

public static class BookingMappings
{
    public static BookingResponse ToResponse(this Booking booking)
    {
        return new BookingResponse
        {
            Id = booking.Id,
            VehicleName = booking.Vehicle != null ? $"{booking.Vehicle.Brand} {booking.Vehicle.Model}": string.Empty,
            CustomerId= booking.CustomerId,
            VehicleId= booking.VehicleId,
            CustomerName= booking.Customer?.UserName ?? string.Empty,
            TotalDays= booking.TotalDays,
            CreatedAt= booking.CreatedAt,
            DailyRate= booking.DailyRate,
            EndDate= booking.EndDate,
            StartDate= booking.StartDate,
            Status= booking.Status,
            TotalAmount = booking.TotalAmount ,
            
        };
    }

    public static List<BookingResponse> ToResponseList(this IEnumerable<Booking> bookings)
    {
        return bookings
            .Select(v => v.ToResponse())
            .ToList();
    }
}
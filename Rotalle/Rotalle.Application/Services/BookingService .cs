using Microsoft.EntityFrameworkCore;
using Rotalle.Application.Interfaces;
using Rotalle.Application.Mappings;
using Rotalle.Domain.Enums;

namespace Rotalle.Application.Services;

public class BookingService : IBookingService
{
    private readonly IUnitOfWork _unitOfWork;

    public BookingService(
        IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<BookingResponse> CreateAsync(string customerId, CreateBookingRequest request)
    {
        var vehicle = await _unitOfWork.Vehicles
            .Include(v => v.Provider)
            .FirstOrDefaultAsync(v =>
                v.Id == request.VehicleId);

        if (vehicle is null)
            throw new KeyNotFoundException(
                "Vehicle not found.");

        if (vehicle.ApprovalStatus != VehicleApprovalStatus.Approved)
            throw new InvalidOperationException(
                "Vehicle is not approved.");

        if (vehicle.Status == VehicleStatus.Inactive)
            throw new InvalidOperationException(
                "Vehicle is unavailable.");

        if (request.StartDate.Date < DateTime.UtcNow.Date)
            throw new InvalidOperationException(
                "Booking cannot start in the past.");

        if (request.EndDate.Date <= request.StartDate.Date)
            throw new InvalidOperationException(
                "End date must be after start date.");

        var hasConflict =
            await _unitOfWork.Bookings.AnyAsync(b =>
                b.VehicleId == request.VehicleId
                &&
                b.Status != BookingStatus.Cancelled
                &&
                b.Status != BookingStatus.Rejected
                &&
                request.StartDate < b.EndDate
                &&
                request.EndDate > b.StartDate);

        if (hasConflict)
            throw new InvalidOperationException(
                "Vehicle is already booked for the selected dates.");

        var totalDays =
            (request.EndDate.Date -
             request.StartDate.Date).Days;

        var totalAmount =
            vehicle.DailyRate * totalDays;

        var booking = new Booking
        {
            VehicleId = vehicle.Id,
            CustomerId = customerId,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            TotalDays = totalDays,
            DailyRate = vehicle.DailyRate,
            TotalAmount = totalAmount,
            Status = BookingStatus.Pending
        };

        await _unitOfWork.Bookings.AddAsync(booking);

        await _unitOfWork.SaveChangesAsync();

        booking = await _unitOfWork.Bookings
            .Include(b => b.Vehicle)
            .Include(b => b.Customer)
            .FirstAsync(b => b.Id == booking.Id);

        return booking.ToResponse();
    }

    public async Task<List<BookingResponse>> GetCustomerBookingsAsync(string customerId)
    {
        var bookings = await _unitOfWork.Bookings
            .Include(b => b.Vehicle)
            .Include(b => b.Customer)
            .Where(b => b.CustomerId == customerId)
            .OrderByDescending(b => b.CreatedAt)
            .ToListAsync();

        return bookings.ToResponseList();
    }

    public async Task<BookingResponse?> GetCustomerBookingAsync(Guid bookingId,string customerId)
    {
        var booking = await _unitOfWork.Bookings
            .Include(b => b.Vehicle)
            .Include(b => b.Customer)
            .FirstOrDefaultAsync(b =>
                b.Id == bookingId &&
                b.CustomerId == customerId);

        return booking?.ToResponse();
    }

    public async Task CancelAsync( Guid bookingId, string customerId,string reason)
    {
        var booking = await _unitOfWork.Bookings.FirstOrDefaultAsync(b => b.Id == bookingId && b.CustomerId == customerId);

        if (booking is null) throw new KeyNotFoundException( "Booking not found.");

        if (booking.Status != BookingStatus.Pending) throw new InvalidOperationException("Only pending bookings can be cancelled.");

        booking.Status = BookingStatus.Cancelled;

        booking.CancellationReason = reason;

        booking.CancelledAt = DateTime.UtcNow;

        await _unitOfWork.SaveChangesAsync();
    }

    public async Task<List<BookingResponse>>GetProviderBookingsAsync(string providerId)
    {
        var bookings = await _unitOfWork.Bookings
            .Include(b => b.Vehicle)
            .Include(b => b.Customer)
            .Where(b =>
                b.Vehicle.ProviderId == providerId)
            .OrderByDescending(b => b.CreatedAt)
            .ToListAsync();

        return bookings.ToResponseList();
    }

    public async Task<BookingResponse?> GetProviderBookingAsync(Guid bookingId, string providerId)
    {
        var booking = await _unitOfWork.Bookings
            .Include(b => b.Vehicle)
            .Include(b => b.Customer)
            .FirstOrDefaultAsync(b =>
                b.Id == bookingId &&
                b.Vehicle.ProviderId == providerId);

        return booking?.ToResponse();
    }

    public async Task ApproveAsync(Guid bookingId,string providerId)
    {
        var booking = await GetProviderBookingEntityAsync(bookingId, providerId);

        if (booking.Status != BookingStatus.Pending)
            throw new InvalidOperationException(
                "Only pending bookings can be approved.");

        booking.Status = BookingStatus.Approved;

        booking.ApprovedAt = DateTime.UtcNow;

        await _unitOfWork.SaveChangesAsync();
    }

    public async Task RejectAsync( Guid bookingId,string providerId, string reason)
    {
        var booking = await GetProviderBookingEntityAsync(bookingId,providerId);

        if (booking.Status != BookingStatus.Pending) throw new InvalidOperationException( "Only pending bookings can be rejected.");

        booking.Status = BookingStatus.Rejected;

        booking.RejectionReason = reason;

        await _unitOfWork.SaveChangesAsync();
    }


    public async Task PickupAsync(Guid bookingId,string providerId)
    {
        var booking =await GetProviderBookingEntityAsync(bookingId,providerId);

        if (booking.Status != BookingStatus.Approved) throw new InvalidOperationException("Booking must be approved first.");

        booking.Status = BookingStatus.Active;

        booking.PickedUpAt = DateTime.UtcNow;

        booking.Vehicle.Status =
            VehicleStatus.Rented;

        await _unitOfWork.SaveChangesAsync();
    }

    public async Task ReturnAsync(Guid bookingId,string providerId)
    {
        var booking =await GetProviderBookingEntityAsync(bookingId, providerId);

        if (booking.Status != BookingStatus.Active) throw new InvalidOperationException("Booking is not active.");

        booking.Status = BookingStatus.Completed;

        booking.ReturnedAt = DateTime.UtcNow;

        booking.Vehicle.Status =
            VehicleStatus.Available;

        await _unitOfWork.SaveChangesAsync();
    }
    private async Task<Booking> GetProviderBookingEntityAsync(Guid bookingId,string providerId)
    {
        var booking = await _unitOfWork.Bookings
            .Include(b => b.Vehicle)
            .Include(b => b.Customer)
            .FirstOrDefaultAsync(b =>
                b.Id == bookingId);

        if (booking is null)
            throw new KeyNotFoundException(
                "Booking not found.");

        if (booking.Vehicle.ProviderId != providerId)
            throw new UnauthorizedAccessException(
                "You can only manage bookings for your own vehicles.");

        return booking;
    }
}
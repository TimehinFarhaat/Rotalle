using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Rotalle.Application.DTOs.Booking;
using System.Security.Claims;

[ApiController]
[Route("api/bookings")]
[Authorize(Roles = "CUSTOMER")]
public class BookingsController : ControllerBase
{
    private readonly IBookingService _bookingService;

    public BookingsController(
        IBookingService bookingService)
    {
        _bookingService = bookingService;
    }
    private string CurrentUserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    [HttpPost]
    public async Task<IActionResult> Create(
        CreateBookingRequest request)
    {
        var booking = await _bookingService.CreateAsync(CurrentUserId,request);

        return Ok(booking);
    }

    [HttpGet]
    public async Task<IActionResult> GetMyBookings()
    {
        var bookings = await _bookingService.GetCustomerBookingsAsync(CurrentUserId);

        return Ok(bookings);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetBooking(
    Guid id)
    {
        var booking =await _bookingService.GetCustomerBookingAsync(id,CurrentUserId);

        if (booking is null)
            return NotFound();

        return Ok(booking);
    }

    [HttpPut("{id:guid}/cancel")]
    public async Task<IActionResult> Cancel(Guid id,BookingDecisionRequest request)
    {
        await _bookingService.CancelAsync(id,CurrentUserId,request.Reason);

        return NoContent();
    }
}
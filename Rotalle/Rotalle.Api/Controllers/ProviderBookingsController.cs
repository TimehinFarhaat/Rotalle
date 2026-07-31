using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Rotalle.Application.DTOs.Booking;
using Rotalle.Application.Interfaces;
using System.Security.Claims;

namespace Rotalle.Api.Controllers;

[ApiController]
[Route("api/provider/bookings")]
[Authorize(Roles = "PROVIDER")]
public class ProviderBookingsController : ControllerBase
{
    private readonly IBookingService _bookingService;

    public ProviderBookingsController( IBookingService bookingService)
    {
        _bookingService = bookingService;
    }
    private string CurrentUserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    [HttpGet]
    public async Task<IActionResult> GetBookings()
    {
        var bookings = await _bookingService.GetProviderBookingsAsync(CurrentUserId);

        return Ok(bookings);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetBooking(
        Guid id)
    {
        var booking =await _bookingService.GetProviderBookingAsync( id, CurrentUserId);

        if (booking is null)
            return NotFound();

        return Ok(booking);
    }

    [HttpPut("{id:guid}/approve")]
    public async Task<IActionResult> Approve( Guid id)
    {
        await _bookingService.ApproveAsync(id,CurrentUserId);

        return NoContent();
    }

    [HttpPut("{id:guid}/reject")]
    public async Task<IActionResult> Reject( Guid id, BookingDecisionRequest request)
    {
        await _bookingService.RejectAsync(id,CurrentUserId,request.Reason);

        return NoContent();
    }

    [HttpPut("{id:guid}/pickup")]
    public async Task<IActionResult> Pickup(
        Guid id)
    {
        await _bookingService .PickupAsync( id,CurrentUserId);

        return NoContent();
    }

    [HttpPut("{id:guid}/return")]
    public async Task<IActionResult> Return(Guid id)
    {
        await _bookingService
            .ReturnAsync(
                id,
                CurrentUserId);

        return NoContent();
    }
}
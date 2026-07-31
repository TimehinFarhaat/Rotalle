using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Rotalle.Application.DTOs.Admin;
using Rotalle.Application.Interfaces;
using Rotalle.Domain.Enums;

//namespace Rotalle.Api.Controllers;

//[ApiController]
//[Route("api/admin")]
//[Authorize(Roles = nameof(UserRole.Admin))]
[ApiController]
[Authorize(Roles = "ADMIN")]
[Route("api/admin")]
public class AdminController : ControllerBase
{
    private readonly IAdminService _adminService;

    public AdminController(IAdminService adminService)
    {
        _adminService = adminService;
    }

    // Vehicles

    [HttpGet("vehicles")]
    public async Task<IActionResult> GetVehicles()
    {
        var vehicles = await _adminService.GetVehiclesAsync();

        return Ok(vehicles);
    }

    [HttpGet("vehicles/pending")]
    public async Task<IActionResult> GetPendingVehicles()
    {
        var vehicles = await _adminService.GetPendingVehiclesAsync();

        return Ok(vehicles);
    }

    [HttpGet("vehicles/{id:guid}")]
    public async Task<IActionResult> GetVehicle(Guid id)
    {
        var vehicle = await _adminService.GetVehicleAsync(id);

        if (vehicle is null)
            return NotFound();

        return Ok(vehicle);
    }

    [HttpPut("vehicles/{id:guid}/approve")]
    public async Task<IActionResult> Approve(Guid id)
    {
        await _adminService.ApproveVehicleAsync(id);

        return NoContent();
    }

    [HttpPut("vehicles/{id:guid}/reject")]
    public async Task<IActionResult> Reject(
        Guid id,
        VehicleApprovalRequest request)
    {
        await _adminService.RejectVehicleAsync(id, request);

        return NoContent();
    }

    [HttpPut("vehicles/{id:guid}/suspend")]
    public async Task<IActionResult> Suspend(
        Guid id,
        VehicleApprovalRequest request)
    {
        await _adminService.SuspendVehicleAsync(id, request);

        return NoContent();
    }

    [HttpPut("vehicles/{id:guid}/reinstate")]
    public async Task<IActionResult> Reinstate(Guid id)
    {
        await _adminService.ReinstateVehicleAsync(id);

        return NoContent();
    }

    [HttpGet("dashboard")]
    public async Task<IActionResult> Dashboard()
    {
        var dashboard = await _adminService.GetDashboardAsync();

        return Ok(dashboard);
    }

    [HttpGet("providers")]
    public async Task<IActionResult> GetProviders()
    {
        var providers = await _adminService.GetProvidersAsync();

        return Ok(providers);
    }

    [HttpGet("providers/{id}")]
    public async Task<IActionResult> GetProvider(string id)
    {
        var provider = await _adminService.GetProviderAsync(id);

        if (provider is null)
            return NotFound();

        return Ok(provider);
    }

    [HttpPut("providers/{id}/activate")]
    public async Task<IActionResult> ActivateProvider(string id)
    {
        await _adminService.ActivateProviderAsync(id);

        return NoContent();
    }

    [HttpPut("providers/{id}/suspend")]
    public async Task<IActionResult> SuspendProvider(string id)
    {
        await _adminService.SuspendProviderAsync(id);

        return NoContent();
    }

    [HttpGet("customers")]
    public async Task<IActionResult> GetCustomers()
    {
        return Ok(await _adminService.GetCustomersAsync());
    }

    [HttpGet("customers/{id}")]
    public async Task<IActionResult> GetCustomer(string id)
    {
        var customer = await _adminService.GetCustomerAsync(id);

        if (customer is null)
            return NotFound();

        return Ok(customer);
    }

    [HttpPut("customers/{id}/activate")]
    public async Task<IActionResult> ActivateCustomer(string id)
    {
        await _adminService.ActivateCustomerAsync(id);

        return NoContent();
    }

    [HttpPut("customers/{id}/suspend")]
    public async Task<IActionResult> SuspendCustomer(string id)
    {
        await _adminService.SuspendCustomerAsync(id);

        return NoContent();
    }


    [HttpGet("bookings")]
    public async Task<IActionResult>
    GetBookings()
    {
        return Ok(
            await _adminService
                .GetBookingsAsync());
    }

    [HttpGet("bookings/{id:guid}")]
    public async Task<IActionResult>
    GetBooking(Guid id)
    {
        var booking =
            await _adminService
                .GetBookingAsync(id);

        if (booking is null)
            return NotFound();

        return Ok(booking);
    }

    [HttpGet("bookings/stats")]
    public async Task<IActionResult>
    GetBookingStats()
    {
        return Ok(
            await _adminService
                .GetBookingStatsAsync());
    }
}
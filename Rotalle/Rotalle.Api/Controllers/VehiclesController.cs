using Microsoft.AspNetCore.Mvc;
using Rotalle.Application.DTOs.Vehicle;
using Rotalle.Application.Interfaces;

namespace Rotalle.Api.Controllers;

[ApiController]
[Route("api/vehicles")]
public class VehiclesController : ControllerBase
{
    private readonly IVehicleService _vehicleService;

    public VehiclesController(
        IVehicleService vehicleService)
    {
        _vehicleService = vehicleService;
    }

    [HttpGet]
    public async Task<IActionResult> Search(
        [FromQuery] VehicleSearchRequest request)
    {
        var vehicles =
            await _vehicleService.SearchAsync(request);

        return Ok(vehicles);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(
        Guid id)
    {
        var vehicle =
            await _vehicleService.GetPublicVehicleAsync(id);

        if (vehicle is null)
        {
            return NotFound(
                new
                {
                    Message = "Vehicle not found."
                });
        }

        return Ok(vehicle);
    }

    [HttpGet("/getAvailableVehicles")]
    public async Task<IActionResult> GetAvailableVehicles()
    {
        var vehicle =
            await _vehicleService.GetPublicVehicles();

        if (vehicle is null)
        {
            return NotFound(
                new
                {
                    Message = "No available vehicle"
                });
        }

        return Ok(vehicle);
    }
}
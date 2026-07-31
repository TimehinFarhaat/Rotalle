using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Rotalle.Application.DTOs.Vehicle;
using Rotalle.Application.Interfaces;

namespace Rotalle.Api.Controllers;

[ApiController]
[Authorize(Roles = "PROVIDER")]
[Route("api/provider/vehicles")]
public class ProviderVehiclesController: ControllerBase
{
    private readonly IVehicleService _vehicleService;

    public ProviderVehiclesController( IVehicleService vehicleService)
    {
        _vehicleService = vehicleService;
    }

    private string CurrentUserId =>User.FindFirstValue(  ClaimTypes.NameIdentifier)!;

    [HttpGet]
    public async Task<IActionResult> GetMyVehicles()
    {
        var vehicles =
            await _vehicleService
                .GetProviderVehiclesAsync(
                    CurrentUserId);

        return Ok(vehicles);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetVehicle(Guid id)
    {
        var vehicle =
            await _vehicleService.GetProviderVehicleAsync(id,CurrentUserId);

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

    [HttpPost]
    public async Task<IActionResult> Create([FromForm] CreateVehicleRequest request)
    {
        var vehicle =
            await _vehicleService.CreateAsync(
                CurrentUserId,
                request);

        return CreatedAtAction(
            nameof(GetVehicle),
            new { id = vehicle.Id },
            vehicle);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update( Guid id,[FromBody]UpdateVehicleRequest request)
    {

       
        var vehicle =
            await _vehicleService.UpdateAsync(
                id,
                CurrentUserId,
                request);

        return Ok(vehicle);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _vehicleService.DeleteAsync(
            id,
            CurrentUserId);

        return NoContent();
    }


    [HttpDelete("{vehicleId:guid}/images/{imageId:guid}")]
    public async Task<IActionResult> DeleteImage(Guid vehicleId, Guid imageId)
    {
        await _vehicleService.DeleteImageAsync(
            vehicleId,
            imageId,
            CurrentUserId);

        return NoContent();
    }

    [HttpPost("{vehicleId:guid}/images")]
    public async Task<IActionResult> AddImages( Guid vehicleId, [FromForm] List<IFormFile> images)
    {
        var vehicle = await _vehicleService.AddImagesAsync(vehicleId,CurrentUserId,images);

        return Ok(vehicle);
    }

    [HttpPut("{vehicleId:guid}/images/{imageId:guid}/primary")]
    public async Task<IActionResult> SetPrimaryImage(Guid vehicleId,Guid imageId)
    {
        await _vehicleService.SetPrimaryImageAsync(
            vehicleId,
            imageId,
            CurrentUserId);

        return NoContent();
    }
}
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Rotalle.Api.Controllers;

[ApiController]
[Route("api/test")]
public class TestController : ControllerBase
{
    [HttpGet("protected")]
    [Authorize]
    public IActionResult Protected()
    {
        return Ok(new
        {
            message = "You are authenticated."
        });
    }

    [HttpGet("customer-only")]
    [Authorize(Roles = "CUSTOMER")]
    public IActionResult CustomerOnly()
    {
        return Ok(new
        {
            message = "You are a customer."
        });
    }

    [HttpGet("provider-only")]
    [Authorize(Roles = "PROVIDER")]
    public IActionResult ProviderOnly()
    {
        return Ok(new
        {
            message = "You are a provider."
        });
    }

    [HttpGet("admin-only")]
    [Authorize(Roles = "ADMIN")]
    public IActionResult AdminOnly()
    {
        return Ok(new
        {
            message = "You are an administrator."
        });
    }
}
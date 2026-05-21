using Microsoft.AspNetCore.Mvc;

namespace VehicleService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult GetHealth()
    {
        return Ok("Healthy");
    }

    [HttpGet("ready")]
    public IActionResult GetReady()
    {
        return Ok("Ready");
    }

    [HttpGet("live")]
    public IActionResult GetLive()
    {
        return Ok("Live");
    }
}

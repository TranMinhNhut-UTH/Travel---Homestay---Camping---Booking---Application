using Microsoft.AspNetCore.Mvc;

namespace VehicleService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult GetHealth()
    {
        return Ok(new { status = "UP", timestamp = DateTime.UtcNow });
    }

    [HttpGet("ready")]
    public IActionResult GetReady()
    {
        return Ok(new { status = "Ready", timestamp = DateTime.UtcNow });
    }

    [HttpGet("live")]
    public IActionResult GetLive()
    {
        return Ok(new { status = "Live", timestamp = DateTime.UtcNow });
    }
}

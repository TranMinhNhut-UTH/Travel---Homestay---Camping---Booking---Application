using Microsoft.AspNetCore.Mvc;
using VehicleService.Services;

namespace VehicleService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VehicleTypesController : ControllerBase
{
    private readonly IVehicleService _vehicleService;

    public VehicleTypesController(IVehicleService vehicleService)
    {
        _vehicleService = vehicleService;
    }

    [HttpGet]
    public async Task<IActionResult> GetVehicleTypes()
    {
        var types = await _vehicleService.GetVehicleTypesAsync();
        return Ok(types);
    }
}

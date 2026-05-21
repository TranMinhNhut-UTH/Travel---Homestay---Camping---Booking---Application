using Microsoft.AspNetCore.Mvc;
using VehicleService.DTOs;
using VehicleService.Services;

namespace VehicleService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DealersController : ControllerBase
{
    private readonly IVehicleService _vehicleService;

    public DealersController(IVehicleService vehicleService)
    {
        _vehicleService = vehicleService;
    }

    [HttpGet]
    public async Task<ActionResult<List<DealerDto>>> GetDealers()
    {
        var dealers = await _vehicleService.GetDealersAsync();
        return Ok(dealers);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<DealerDto>> GetDealer(int id)
    {
        var dealer = await _vehicleService.GetDealerByIdAsync(id);
        if (dealer == null)
        {
            return NotFound(new { message = "Dealer not found" });
        }
        return Ok(dealer);
    }

    [HttpPost]
    public async Task<ActionResult<DealerDto>> CreateDealer(CreateDealerDto createDto)
    {
        try
        {
            var dealer = await _vehicleService.CreateDealerAsync(createDto);
            return CreatedAtAction(nameof(GetDealer), new { id = dealer.Id }, dealer);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<DealerDto>> UpdateDealer(int id, UpdateDealerDto updateDto)
    {
        try
        {
            var dealer = await _vehicleService.UpdateDealerAsync(id, updateDto);
            if (dealer == null)
            {
                return NotFound(new { message = "Dealer not found" });
            }
            return Ok(dealer);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteDealer(int id)
    {
        var deleted = await _vehicleService.DeleteDealerAsync(id);
        if (!deleted)
        {
            return NotFound(new { message = "Dealer not found" });
        }
        return NoContent();
    }
}

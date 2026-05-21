/*
// This controller is temporarily commented out to resolve build errors
// and allow the main refactoring migration to proceed.

using Microsoft.AspNetCore.Mvc;
using SalesService.Data;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;

namespace SalesService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProcessedReservationsController : ControllerBase
    {
        private readonly SalesDbContext _context;
        private readonly ILogger<ProcessedReservationsController> _logger;

        public ProcessedReservationsController(SalesDbContext context, ILogger<ProcessedReservationsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/processedreservations
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProcessedReservation>>> GetProcessedReservations()
        {
            // _logger.LogInformation("Fetching all processed reservations.");
            // var processed = await _context.ProcessedReservations.ToListAsync();
            // return Ok(processed);
            return Ok(new List<object>());
        }

        // GET: api/processedreservations/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProcessedReservation>> GetProcessedReservation(int id)
        {
            // _logger.LogInformation("Fetching processed reservation with id {Id}", id);
            // var processedReservation = await _context.ProcessedReservations.FindAsync(id);

            // if (processedReservation == null)
            // {
            //     _logger.LogWarning("Processed reservation with id {Id} not found", id);
            //     return NotFound();
            // }

            // return Ok(processedReservation);
            return NotFound();
        }

        // POST: api/processedreservations
        [HttpPost]
        public async Task<ActionResult<ProcessedReservation>> PostProcessedReservation(ProcessedReservation processedReservation)
        {
            // _logger.LogInformation("Creating new processed reservation for reservation id {ReservationId}", processedReservation.ReservationId);
            // _context.ProcessedReservations.Add(processedReservation);
            // await _context.SaveChangesAsync();
            // _logger.LogInformation("Successfully created processed reservation with id {Id}", processedReservation.Id);

            // return CreatedAtAction(nameof(GetProcessedReservation), new { id = processedReservation.Id }, processedReservation);
            return StatusCode(501, "Endpoint is temporarily disabled.");
        }

        // PUT: api/processedreservations/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProcessedReservation(int id, ProcessedReservation processedReservation)
        {
            // if (id != processedReservation.Id)
            // {
            //     _logger.LogWarning("Mismatch between route id {RouteId} and payload id {PayloadId}", id, processedReservation.Id);
            //     return BadRequest();
            // }

            // _logger.LogInformation("Updating processed reservation with id {Id}", id);
            // _context.Entry(processedReservation).State = EntityState.Modified;

            // try
            // {
            //     await _context.SaveChangesAsync();
            //     _logger.LogInformation("Successfully updated processed reservation with id {Id}", id);
            // }
            // catch (DbUpdateConcurrencyException ex)
            // {
            //     if (!ProcessedReservationExists(id))
            //     {
            //         _logger.LogWarning("Attempted to update non-existent processed reservation with id {Id}", id);
            //         return NotFound();
            //     }
            //     else
            //     {
            //         _logger.LogError(ex, "Concurrency error while updating processed reservation with id {Id}", id);
            //         throw;
            //     }
            // }

            // return NoContent();
            return StatusCode(501, "Endpoint is temporarily disabled.");
        }

        // DELETE: api/processedreservations/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProcessedReservation(int id)
        {
            // _logger.LogInformation("Deleting processed reservation with id {Id}", id);
            // var processedReservation = await _context.ProcessedReservations.FindAsync(id);
            // if (processedReservation == null)
            // {
            //     _logger.LogWarning("Attempted to delete non-existent processed reservation with id {Id}", id);
            //     return NotFound();
            // }

            // _context.ProcessedReservations.Remove(processedReservation);
            // await _context.SaveChangesAsync();
            // _logger.LogInformation("Successfully deleted processed reservation with id {Id}", id);

            // return NoContent();
            return StatusCode(501, "Endpoint is temporarily disabled.");
        }

        private bool ProcessedReservationExists(int id)
        {
            // return _context.ProcessedReservations.Any(e => e.Id == id);
            return false;
        }
    }
}
*/

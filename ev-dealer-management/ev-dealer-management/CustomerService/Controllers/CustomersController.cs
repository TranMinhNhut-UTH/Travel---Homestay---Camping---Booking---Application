using Microsoft.AspNetCore.Mvc;
using CustomerService.Services;
using CustomerService.DTOs;
using CustomerService.Models; // Required for the event model if it's not in DTOs

namespace CustomerService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomersController : ControllerBase
    {
        private readonly ICustomerService _customerService;
        private readonly IMessageProducer _messageProducer;
        private readonly ILogger<CustomersController> _logger;

        public CustomersController(ICustomerService customerService, IMessageProducer messageProducer, ILogger<CustomersController> logger)
        {
            _customerService = customerService;
            _messageProducer = messageProducer;
            _logger = logger;
        }

        // GET: api/Customers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CustomerDto>>> GetCustomers()
        {
            var customers = await _customerService.GetAllCustomersAsync();
            return Ok(customers);
        }

        // GET: api/Customers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CustomerDto>> GetCustomer(int id)
        {
            var customer = await _customerService.GetCustomerByIdAsync(id);

            if (customer == null)
            {
                return NotFound();
            }

            return Ok(customer);
        }

        // POST: api/Customers
        [HttpPost]
        public async Task<ActionResult<CustomerDto>> PostCustomer(CreateCustomerRequest createCustomerRequest)
        {
            try
            {
                var createdCustomer = await _customerService.CreateCustomerAsync(createCustomerRequest);

                /*
                // Safely create and publish the event - DISABLED FOR NOW TO PREVENT TIMEOUTS
                try
                {
                    // Create a deterministic GUID from the integer customer ID to satisfy the event model
                    byte[] idBytes = new byte[16];
                    BitConverter.GetBytes(createdCustomer.Id).CopyTo(idBytes, 0);
                    var customerGuid = new Guid(idBytes);

                    var customerCreatedEvent = new CustomerCreatedEvent
                    {
                        CustomerId = customerGuid, // Use the generated GUID
                        Name = createdCustomer.Name,
                        Email = createdCustomer.Email,
                        Timestamp = DateTime.UtcNow
                    };

                    _messageProducer.PublishMessage(customerCreatedEvent, "customer.created");
                    _logger.LogInformation("CustomerCreatedEvent published for customer: {CustomerName}", createdCustomer.Name);
                }
                catch (Exception ex)
                {
                    // Log the failure to publish the event, but don't let it crash the whole operation
                    _logger.LogWarning(ex, "Failed to publish CustomerCreatedEvent for customer: {CustomerName}", createCustomerRequest.Name);
                }
                */

                return Ok(createdCustomer);
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex, "Customer creation failed: {Message}", ex.Message);
                return Conflict(new { message = ex.Message }); // e.g., email already exists
            }
            catch (Exception ex)
            {
                // This will now only catch errors from the customer creation itself
                _logger.LogError(ex, "Error creating customer: {CustomerName}", createCustomerRequest.Name);
                return StatusCode(500, "Internal server error");
            }
        }

        // PUT: api/Customers/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCustomer(int id, UpdateCustomerRequest updateCustomerRequest)
        {
            try
            {
                var updatedCustomer = await _customerService.UpdateCustomerAsync(id, updateCustomerRequest);
                if (updatedCustomer == null)
                {
                    return NotFound();
                }
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating customer with ID: {CustomerId}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        // DELETE: api/Customers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomer(int id)
        {
            var result = await _customerService.DeleteCustomerAsync(id);
            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}

using System.ComponentModel.DataAnnotations;

namespace CustomerService.DTOs
{
    public class CreateTestDriveRequest
    {
        [Required]
        public int CustomerId { get; set; }

        [Required]
        public int VehicleId { get; set; }

        [Required]
        public int DealerId { get; set; }

        [Required]
        public DateTime AppointmentDate { get; set; }

        public string? Notes { get; set; }

        public string? Status { get; set; } // Added Status field
    }
}

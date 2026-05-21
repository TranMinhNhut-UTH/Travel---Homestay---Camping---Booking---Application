using System.ComponentModel.DataAnnotations;

namespace CustomerService.DTOs
{
    public class CreateComplaintRequest
    {
        [Required]
        public int CustomerId { get; set; }

        [Required]
        [StringLength(50)] // New field
        public string Type { get; set; } = "Khiếu nại"; // Default value

        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        public int? AssignedToStaffID { get; set; } // New field
        public string? Priority { get; set; } // New field
        public int? RelatedOrderID { get; set; } // New field
        public int? RelatedVehicleID { get; set; } // New field
    }
}

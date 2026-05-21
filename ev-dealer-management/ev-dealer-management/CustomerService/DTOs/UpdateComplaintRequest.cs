using System.ComponentModel.DataAnnotations;

namespace CustomerService.DTOs
{
    public class UpdateComplaintRequest
    {
        [StringLength(50)] // New field
        public string? Type { get; set; }

        [StringLength(200)]
        public string? Title { get; set; }

        public string? Description { get; set; }

        public string? Status { get; set; } // e.g., "Open", "In Progress", "Resolved", "Closed"

        public string? Resolution { get; set; }

        public int? AssignedToStaffID { get; set; } // New field
        public string? Priority { get; set; } // New field
        public int? RelatedOrderID { get; set; } // New field
        public int? RelatedVehicleID { get; set; } // New field
    }
}

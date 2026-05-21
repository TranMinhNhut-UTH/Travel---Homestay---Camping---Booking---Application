using System.ComponentModel.DataAnnotations;

namespace CustomerService.DTOs;

public class UpdateCustomerRequest
{
    [StringLength(100)]
    public string? Name { get; set; }

    [EmailAddress]
    public string? Email { get; set; }

    [Phone]
    public string? Phone { get; set; }

    public string? Address { get; set; }

    public int? DealerId { get; set; } // Made nullable for updates

    public string? Status { get; set; } // e.g., "active", "inactive", "pending"

    // Optional: Add DateOfBirth if needed based on detailed requirements
    // public DateTime? DateOfBirth { get; set; }
}

using System.ComponentModel.DataAnnotations;

namespace CustomerService.DTOs;

public class CreateCustomerRequest
{
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Phone]
    public string? Phone { get; set; }

    public string? Address { get; set; }

    [Required]
    public int DealerId { get; set; }

    public string? Status { get; set; } // e.g., "active", "inactive", "pending"

    // Optional: Add DateOfBirth if needed based on detailed requirements
    // public DateTime? DateOfBirth { get; set; }
}

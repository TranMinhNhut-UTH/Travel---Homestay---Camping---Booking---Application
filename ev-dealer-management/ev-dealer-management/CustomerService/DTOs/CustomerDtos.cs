using System.ComponentModel.DataAnnotations;

namespace CustomerService.DTOs
{
    public class CreateCustomerDto
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

        public string? Status { get; set; }
    }

    public class UpdateCustomerDto
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

        public string? Status { get; set; }
    }
}

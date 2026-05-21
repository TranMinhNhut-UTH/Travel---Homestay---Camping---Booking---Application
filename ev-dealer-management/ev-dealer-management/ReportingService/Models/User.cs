using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ev_dealer_reporting.Models;

public class User
{
    [Key]
    public int Id { get; set; }

    public required string Username { get; set; }
    public required string Email { get; set; }
    public required string FullName { get; set; }

    public required string PasswordHash { get; set; }
    public required string Role { get; set; }
    public bool IsActive { get; set; }

    public int? DealerId { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

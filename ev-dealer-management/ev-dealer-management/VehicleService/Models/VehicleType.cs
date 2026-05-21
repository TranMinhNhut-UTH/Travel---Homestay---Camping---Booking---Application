using System.ComponentModel.DataAnnotations;

namespace VehicleService.Models;

public class VehicleType
{
    [Key]
    public int Id { get; set; }

    [Required]
    [StringLength(50)]
    public string Value { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string Label { get; set; } = string.Empty;

    // Navigation property
    public ICollection<Vehicle> Vehicles { get; set; } = new List<Vehicle>();
}

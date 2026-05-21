using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Quote
{
    [Key]
    [Column("QuoteId")]
    public int Id { get; set; }

    // --- Foreign Keys ---
    [Required]
    public int CustomerId { get; set; }

    [Required]
    public int DealerId { get; set; }

    [Required]
    public int SalespersonId { get; set; }

    [Required]
    public int VehicleId { get; set; }

    [Required]
    public int VehicleVariantId { get; set; }

    [Required]
    public int ColorId { get; set; }
    
    // --- Vehicle Quantity ---
    [Required]
    public int Quantity { get; set; }

    // --- Pricing ---
    [Required]
    [Column(TypeName = "decimal(18, 2)")]
    public decimal BasePrice { get; set; }

    [Required]
    [Column(TypeName = "decimal(18, 2)")]
    public decimal TotalBasePrice { get; set; }

    // --- Quote Status ---
    [Required]
    [MaxLength(50)]
    public string Status { get; set; } = "Active";
    // Active | ConvertedToOrder | Cancelled

    // --- Additional Notes (Added for frontend display) ---
    [MaxLength(1000)] // Optional: Add a max length for notes
    public string? Notes { get; set; }

    // --- Timestamps ---
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

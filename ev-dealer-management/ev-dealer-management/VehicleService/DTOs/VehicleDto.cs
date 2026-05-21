using System.ComponentModel.DataAnnotations;

namespace VehicleService.DTOs;

public class VehicleDto
{
    public int Id { get; set; }
    public string Model { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public double BatteryCapacity { get; set; }
    public int Range { get; set; }
    public int StockQuantity { get; set; }
    public string? Description { get; set; }
    public int DealerId { get; set; }
    public string DealerName { get; set; } = string.Empty;
    public List<VehicleImageDto> Images { get; set; } = new();
    public List<ColorVariantDto> ColorVariants { get; set; } = new();
    public VehicleSpecificationsDto? Specifications { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class VehicleImageDto
{
    public int Id { get; set; }
    public string Url { get; set; } = string.Empty;
    public string? AltText { get; set; }
    public int Order { get; set; }
}

public class ColorVariantDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Hex { get; set; } = string.Empty;
    public int Stock { get; set; }
}

public class VehicleSpecificationsDto
{
    public int Id { get; set; }
    public string? Acceleration { get; set; }
    public string? TopSpeed { get; set; }
    public string? Charging { get; set; }
    public string? Warranty { get; set; }
    public int? Seats { get; set; }
    public string? Cargo { get; set; }
}

public class CreateVehicleDto
{
    [Required]
    [StringLength(200)]
    public string Model { get; set; } = string.Empty;

    [Required]
    [StringLength(50)]
    public string Type { get; set; } = string.Empty;

    [Required]
    [Range(0, double.MaxValue)]
    public decimal Price { get; set; }

    [Required]
    [Range(0, double.MaxValue)]
    public double BatteryCapacity { get; set; }

    [Required]
    [Range(0, int.MaxValue)]
    public int Range { get; set; }

    [Required]
    [Range(0, int.MaxValue)]
    public int StockQuantity { get; set; }

    [StringLength(1000)]
    public string? Description { get; set; }

    [Required]
    public int DealerId { get; set; }

    public List<CreateVehicleImageDto> Images { get; set; } = new();
    public List<CreateColorVariantDto> ColorVariants { get; set; } = new();
    public CreateVehicleSpecificationsDto? Specifications { get; set; }
}

public class CreateVehicleImageDto
{
    public string? Url { get; set; } // Added to satisfy backend validation

    [StringLength(100)]
    public string? AltText { get; set; }

    public int? Order { get; set; } = 0; // Made nullable
}

public class CreateColorVariantDto
{
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [StringLength(7)]
    public string Hex { get; set; } = string.Empty;

    [Range(0, int.MaxValue)]
    public int Stock { get; set; } = 0;
}

public class CreateVehicleSpecificationsDto
{
    [StringLength(100)]
    public string? Acceleration { get; set; }

    [StringLength(100)]
    public string? TopSpeed { get; set; }

    [StringLength(100)]
    public string? Charging { get; set; }

    [StringLength(100)]
    public string? Warranty { get; set; }

    [Range(1, 20)]
    public int? Seats { get; set; }

    [StringLength(100)]
    public string? Cargo { get; set; }
}

public class UpdateVehicleDto
{
    [Required]
    [StringLength(200)]
    public string Model { get; set; } = string.Empty;

    [Required]
    [StringLength(50)]
    public string Type { get; set; } = string.Empty;

    [Required]
    [Range(0, double.MaxValue)]
    public decimal Price { get; set; }

    [Required]
    [Range(0, double.MaxValue)]
    public double BatteryCapacity { get; set; }

    [Required]
    [Range(0, int.MaxValue)]
    public int Range { get; set; }

    [Required]
    [Range(0, int.MaxValue)]
    public int StockQuantity { get; set; }

    [StringLength(1000)]
    public string? Description { get; set; }

    [Required]
    public int DealerId { get; set; }

    public List<CreateVehicleImageDto> Images { get; set; } = new();
    public List<CreateColorVariantDto> ColorVariants { get; set; } = new();
    public CreateVehicleSpecificationsDto? Specifications { get; set; }
}

public class VehicleQueryDto
{
    public string? Search { get; set; }
    public string? Type { get; set; }
    public int? DealerId { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? SortBy { get; set; } = "CreatedAt";
    public string? SortOrder { get; set; } = "desc";
}

public class PaginatedResult<T>
{
    public List<T> Items { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
    public bool HasNextPage => Page < TotalPages;
    public bool HasPreviousPage => Page > 1;
}

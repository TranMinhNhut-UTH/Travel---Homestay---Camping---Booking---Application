namespace ev_dealer_reporting.Services;

/// <summary>
/// Service để fetch dữ liệu từ VehicleService
/// </summary>
public interface IVehicleDataService
{
    Task<List<VehicleInventoryDto>> GetVehiclesAsync(int? dealerId = null);
    Task<VehicleInventoryDto?> GetVehicleByIdAsync(int vehicleId);
    Task<List<DealerDto>> GetDealersAsync();
}

public class VehicleInventoryDto
{
    public int Id { get; set; }
    public string Model { get; set; } = string.Empty;
    public int DealerId { get; set; }
    public string DealerName { get; set; } = string.Empty;
    public int StockQuantity { get; set; }
    public decimal Price { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class DealerDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Address { get; set; }
    public string? Region { get; set; }
}



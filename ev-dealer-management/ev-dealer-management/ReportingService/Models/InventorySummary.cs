using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ev_dealer_reporting.Models;

/// <summary>
/// Bảng tổng hợp tồn kho xe theo từng đại lý.
/// Dữ liệu này được cập nhật từ các sự kiện của VehicleService.
/// </summary>
public class InventorySummary
{
    [Key]
    public Guid Id { get; set; }

    public int VehicleId { get; set; } // Changed from Guid to int
    
    public required string VehicleName { get; set; } // Denormalized data

    public int DealerId { get; set; } // Changed from Guid to int
    
    public required string DealerName { get; set; } // Denormalized data

    public required string Region { get; set; } // Miền Bắc, Miền Trung, Miền Nam

    public int StockCount { get; set; }
    
    public DateTime LastUpdatedAt { get; set; }
}

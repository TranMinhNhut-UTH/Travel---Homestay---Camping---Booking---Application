namespace NotificationService.DTOs;

public class VehicleReservedEvent
{
    public int VehicleId { get; set; }
    public string VehicleName { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public int? ColorVariantId { get; set; }
    public string? ColorVariantName { get; set; }
    public int Quantity { get; set; }
    public string? Notes { get; set; }
    public DateTime ReservedAt { get; set; }
    public string? DeviceToken { get; set; }
}

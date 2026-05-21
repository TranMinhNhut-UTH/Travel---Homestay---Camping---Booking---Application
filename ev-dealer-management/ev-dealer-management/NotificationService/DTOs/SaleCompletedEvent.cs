namespace NotificationService.DTOs;

public class SaleCompletedEvent
{
    public required string OrderId { get; set; }
    public required string CustomerEmail { get; set; }
    public required string CustomerName { get; set; }
    public required string VehicleModel { get; set; }
    public decimal TotalPrice { get; set; }
    public DateTime CompletedAt { get; set; }
    public string? DeviceToken { get; set; }
}

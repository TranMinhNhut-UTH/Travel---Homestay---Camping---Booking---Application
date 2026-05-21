namespace NotificationService.DTOs;

public class OrderCreatedEvent
{
    public required string OrderId { get; set; }
    public required string OrderNumber { get; set; }
    public int CustomerId { get; set; }
    public int DealerId { get; set; }
    public int VehicleId { get; set; }
    public int Quantity { get; set; }
    public decimal TotalPrice { get; set; }
    public string PaymentMethod { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public string? DeviceToken { get; set; } // Added for push notifications
}


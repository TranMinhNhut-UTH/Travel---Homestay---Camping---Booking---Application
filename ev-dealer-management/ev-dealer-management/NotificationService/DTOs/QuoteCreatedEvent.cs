namespace NotificationService.DTOs;

public class QuoteCreatedEvent
{
    public required string QuoteId { get; set; }
    public int CustomerId { get; set; }
    public int DealerId { get; set; }
    public int SalespersonId { get; set; }
    public int VehicleId { get; set; }
    public int Quantity { get; set; }
    public decimal TotalBasePrice { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public string? DeviceToken { get; set; } // Added for push notifications
}


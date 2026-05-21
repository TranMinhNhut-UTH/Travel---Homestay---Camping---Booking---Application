namespace SalesService.DTOs
{
    /// <summary>
    /// Event published when a sale/order is completed
    /// Matches NotificationService.DTOs.SaleCompletedEvent structure
    /// </summary>
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

    /// <summary>
    /// Event published when a new order is created
    /// </summary>
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
    }

    /// <summary>
    /// Event published when a payment is received
    /// </summary>
    public class PaymentReceivedEvent
    {
        public required string PaymentId { get; set; }
        public required string OrderId { get; set; }
        public decimal Amount { get; set; }
        public string PaymentMethod { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime PaidDate { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    /// <summary>
    /// Event published when order status changes
    /// </summary>
    public class OrderStatusChangedEvent
    {
        public required string OrderId { get; set; }
        public required string OrderNumber { get; set; }
        public string OldStatus { get; set; } = string.Empty;
        public string NewStatus { get; set; } = string.Empty;
        public DateTime ChangedAt { get; set; }
    }

    /// <summary>
    /// Event published when a new quote is created
    /// </summary>
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
    }
}

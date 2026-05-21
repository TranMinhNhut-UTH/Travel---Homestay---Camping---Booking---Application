namespace NotificationService.DTOs
{
    public class ContractCreatedEvent
    {
        public required string ContractId { get; set; }
        public required string ContractNumber { get; set; }
        public int OrderId { get; set; }
        public int CustomerId { get; set; }
        public int DealerId { get; set; }
        public int SalespersonId { get; set; }
        public decimal TotalAmount { get; set; }
        public string PaymentStatus { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public string? DeviceToken { get; set; } // Added for push notifications
    }
}


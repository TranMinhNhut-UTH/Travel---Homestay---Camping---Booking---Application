namespace CustomerService.DTOs
{
    // Event từ VehicleService khi có reservation mới
    public class VehicleReservedEvent
    {
        public int ReservationId { get; set; }
        public int VehicleId { get; set; }
        public string VehicleModel { get; set; } = string.Empty;
        public string CustomerName { get; set; } = string.Empty;
        public string CustomerEmail { get; set; } = string.Empty;
        public string CustomerPhone { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal TotalPrice { get; set; }
        public int? ColorVariantId { get; set; }
        public string? ColorVariantName { get; set; }
        public int DealerId { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
namespace VehicleService.DTOs
{
    public class VehicleCreatedEvent
    {
        public int VehicleId { get; set; }
        public string Model { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int DealerId { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class VehicleUpdatedEvent
    {
        public int VehicleId { get; set; }
        public string Model { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int DealerId { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class VehicleDeletedEvent
    {
        public int VehicleId { get; set; }
        public DateTime DeletedAt { get; set; }
    }
}

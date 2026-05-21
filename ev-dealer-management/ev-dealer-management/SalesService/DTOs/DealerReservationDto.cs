namespace SalesService.DTOs;

public class DealerReservationDto
{
    public int Id { get; set; }
    public int ReservationId { get; set; }
    public string VehicleId { get; set; } = string.Empty;
    public int DealerId { get; set; }
    public string Status { get; set; } = string.Empty;
    public string AssignedStaff { get; set; } = string.Empty;
    public DateTime ProcessedAt { get; set; }
    public DateTime CreatedAt { get; set; }
}





namespace CustomerService.Models;

public class TestDrive
{
    public int Id { get; set; }
    public int CustomerId { get; set; }
    public int VehicleId { get; set; } // Assuming VehicleId comes from VehicleService
    public int DealerId { get; set; } // Assuming DealerId comes from DealerManagementService
    public DateTime AppointmentDate { get; set; }
    public string Status { get; set; } = "Đã lên lịch"; // Changed default status to Vietnamese
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Customer? Customer { get; set; }
}

using System;
using System.Collections.Generic;

namespace CustomerService.DTOs;

public class CustomerDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? Address { get; set; }
    public string? Status { get; set; }
    public DateTime JoinDate { get; set; }

    public ICollection<PurchaseDto> Purchases { get; set; } = new List<PurchaseDto>();
    public ICollection<TestDriveDto> TestDrives { get; set; } = new List<TestDriveDto>();
}

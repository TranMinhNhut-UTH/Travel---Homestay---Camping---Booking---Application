using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CustomerService.Models;

public class ComplaintHistoryEntry
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int ComplaintId { get; set; } // Foreign key to Complaint
    [ForeignKey("ComplaintId")]
    public Complaint? Complaint { get; set; }

    [Required]
    public int StaffId { get; set; } // Nhân viên thực hiện hành động
    // public Staff? Staff { get; set; } // Navigation property for Staff

    [Required]
    [StringLength(100)]
    public string ActionType { get; set; } = string.Empty; // e.g., 'Cập nhật trạng thái', 'Thêm ghi chú', 'Chuyển tiếp'

    public string? Details { get; set; } // Mô tả chi tiết hành động hoặc ghi chú

    public DateTime ActionDate { get; set; } = DateTime.UtcNow;
}

using System;
using System.Collections.Generic; // Thêm using này
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema; // Thêm using này

namespace CustomerService.Models;

public class Complaint
{
    public int Id { get; set; }

    [Required]
    public int CustomerId { get; set; } // Foreign key to Customer

    [Required]
    [StringLength(50)] // Thêm độ dài cho Type
    public string Type { get; set; } = "Khiếu nại"; // e.g., 'Phản hồi', 'Khiếu nại', 'Gợi ý', 'Yêu cầu hỗ trợ'

    [Required]
    [StringLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Description { get; set; } = string.Empty;

    [StringLength(50)] // Thêm độ dài cho Status
    public string Status { get; set; } = "Mới"; // e.g., "Mới", "Đang xử lý", "Đã giải quyết", "Đã đóng", "Đã chuyển tiếp"

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? ResolvedAt { get; set; }
    public string? Resolution { get; set; }

    public int? AssignedToStaffID { get; set; } // ID của nhân viên được giao xử lý
    // Navigation property for Staff (assuming a Staff model exists in UserService or shared)
    // public Staff AssignedToStaff { get; set; }

    [StringLength(20)] // Thêm độ dài cho Priority
    public string? Priority { get; set; } // e.g., 'Thấp', 'Trung bình', 'Cao', 'Khẩn cấp'

    public int? RelatedOrderID { get; set; } // Có thể liên kết với một đơn hàng cụ thể
    public int? RelatedVehicleID { get; set; } // Có thể liên kết với một xe cụ thể

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow; // Thời gian cập nhật cuối cùng

    // Navigation properties
    public Customer? Customer { get; set; }
    public ICollection<ComplaintAttachment>? Attachments { get; set; } // Danh sách tệp đính kèm
    public ICollection<ComplaintHistoryEntry>? History { get; set; } // Lịch sử xử lý
}

using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CustomerService.Models;

public class ComplaintAttachment
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int ComplaintId { get; set; } // Foreign key to Complaint
    [ForeignKey("ComplaintId")]
    public Complaint? Complaint { get; set; }

    [Required]
    [StringLength(255)]
    public string FileName { get; set; } = string.Empty;

    [Required]
    [StringLength(500)]
    public string FilePath { get; set; } = string.Empty; // Đường dẫn lưu trữ tệp

    public int? UploadedByStaffID { get; set; }
    // public Staff? UploadedByStaff { get; set; } // Navigation property for Staff

    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
}

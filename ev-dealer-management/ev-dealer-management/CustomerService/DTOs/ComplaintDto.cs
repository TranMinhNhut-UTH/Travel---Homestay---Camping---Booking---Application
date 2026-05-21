using System;
using System.Collections.Generic;

namespace CustomerService.DTOs
{
    public class ComplaintDto
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public string Type { get; set; } = string.Empty; // New field
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime? ResolvedAt { get; set; }
        public string? Resolution { get; set; }
        public string? CustomerName { get; set; }
        public int? AssignedToStaffID { get; set; } // New field
        public string? Priority { get; set; } // New field
        public int? RelatedOrderID { get; set; } // New field
        public int? RelatedVehicleID { get; set; } // New field
        public DateTime UpdatedAt { get; set; } // New field

        public ICollection<ComplaintAttachmentDto>? Attachments { get; set; }
        public ICollection<ComplaintHistoryEntryDto>? History { get; set; }
    }

    public class ComplaintAttachmentDto
    {
        public int Id { get; set; }
        public int ComplaintId { get; set; }
        public string FileName { get; set; } = string.Empty;
        public string FilePath { get; set; } = string.Empty;
        public int? UploadedByStaffID { get; set; }
        public DateTime UploadedAt { get; set; }
    }

    public class ComplaintHistoryEntryDto
    {
        public int Id { get; set; }
        public int ComplaintId { get; set; }
        public int StaffId { get; set; }
        public string ActionType { get; set; } = string.Empty;
        public string? Details { get; set; }
        public DateTime ActionDate { get; set; }
    }
}

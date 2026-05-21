using System;

namespace ev_dealer_reporting.Models
{
    public class ReportRequest
    {
        public int Id { get; set; }
        public string Type { get; set; } = string.Empty; // e.g. sales, inventory
        public DateTime? From { get; set; }
        public DateTime? To { get; set; }
        public string RequestedBy { get; set; } = string.Empty;
        public string Status { get; set; } = "Pending"; // Pending/Running/Completed/Failed
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? CompletedAt { get; set; }
    }
}

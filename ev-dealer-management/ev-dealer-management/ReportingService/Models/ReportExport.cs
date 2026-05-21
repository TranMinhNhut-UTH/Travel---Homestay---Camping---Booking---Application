using System;

namespace ev_dealer_reporting.Models
{
    public class ReportExport
    {
        public int Id { get; set; }
        public int? ReportRequestId { get; set; }
        public string FileName { get; set; } = string.Empty;
        public string ContentType { get; set; } = "text/csv";
        public long SizeBytes { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

using System;
using System.ComponentModel.DataAnnotations; // Required for [Key] if not already present
using System.ComponentModel.DataAnnotations.Schema; // Required for [Column] if not already present

namespace SalesService.Models
{
    public class Delivery
    {
        // Helper method to get Vietnam local time
        private static DateTime GetVietnamNow()
        {
            try { return TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time")); }
            catch { return DateTime.UtcNow; }
        }

        public Guid DeliveryId { get; set; }

        // FK
        public Guid OrderId { get; set; }
        public Order? Order { get; set; }

        public DateTime? DeliveryDate { get; set; }
        public string? Location { get; set; }

        public string Status { get; set; } = "Scheduled"; 
        // Scheduled / Delivered / Cancelled

        // New fields
        public string? ReceiverName { get; set; }
        public string? ReceiverPhone { get; set; }

        public string? Notes { get; set; }

        // Audit
        public DateTime CreatedAt { get; set; } = GetVietnamNow(); // Use GetVietnamNow()
        public DateTime UpdatedAt { get; set; } = GetVietnamNow(); // Use GetVietnamNow()
    }
}

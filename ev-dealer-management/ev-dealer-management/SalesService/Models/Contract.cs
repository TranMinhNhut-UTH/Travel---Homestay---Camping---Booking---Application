using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SalesService.Models
{
    [Table("Contracts")]
    [Index(nameof(ContractNumber), IsUnique = true)]
    public class Contract
    {
        // Helper method to get Vietnam local time
        private static DateTime GetVietnamNow()
        {
            try { return TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time")); }
            catch { return DateTime.UtcNow; }
        }

        [Key]
        public int ContractId { get; set; }

        [Required]
        public int OrderId { get; set; }

        [Required]
        public int CustomerId { get; set; }

        [Required]
        public int DealerId { get; set; }

        [Required]
        public int SalespersonId { get; set; }

        [Required]
        [StringLength(50)]
        public string ContractNumber { get; set; }

        public DateOnly SignedDate { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalAmount { get; set; }

        [Required]
        [StringLength(30)]
        public string PaymentStatus { get; set; } // Unpaid / Partial / Paid

        [Required]
        [StringLength(30)]
        public string Status { get; set; } // PendingApproval / Approved...

        public string? Notes { get; set; }

        public DateTime CreatedAt { get; set; } = GetVietnamNow(); // Use GetVietnamNow()
        public DateTime UpdatedAt { get; set; } = GetVietnamNow(); // Use GetVietnamNow()

        // --- Navigation Property ---
        [ForeignKey("OrderId")]
        public virtual Order Order { get; set; }
    }
}

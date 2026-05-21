using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SalesService.Models
{
    public class Order
    {
        // Helper method to get Vietnam local time
        private static DateTime GetVietnamNow()
        {
            try { return TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time")); }
            catch { return DateTime.UtcNow; }
        }

        [Key]
        public int OrderId { get; set; }

        [Required]
        public int QuoteId { get; set; }

        [Required]
        public int CustomerId { get; set; }

        [Required]
        public int DealerId { get; set; }

        [Required]
        public int SalespersonId { get; set; }

        [Required]
        [StringLength(50)]
        public string OrderNumber { get; set; }

        // --- Vehicle Info (Merged from OrderItem) ---
        [Required]
        public int VehicleId { get; set; }
        [Required]
        public int VariantId { get; set; }
        [Required]
        public int ColorId { get; set; }
        [Required]
        public int Quantity { get; set; }
        [Required]
        [Column(TypeName = "decimal(18, 2)")]
        public decimal UnitPrice { get; set; }

        // --- Discount ---
        [Column(TypeName = "decimal(18, 2)")]
        public decimal? DiscountPercent { get; set; }
        [Column(TypeName = "decimal(18, 2)")]
        public decimal? DiscountAmount { get; set; }

        // --- Calculated Pricing ---
        [Required]
        [Column(TypeName = "decimal(18, 2)")]
        public decimal SubTotal { get; set; }
        [Required]
        [Column(TypeName = "decimal(18, 2)")]
        public decimal TotalDiscount { get; set; }
        [Required]
        [Column(TypeName = "decimal(18, 2)")]
        public decimal TotalPrice { get; set; }

        // --- Payment & Delivery ---
        [Required]
        [StringLength(50)]
        public string PaymentMethod { get; set; } // Trả thẳng / Trả góp
        [Required]
        [StringLength(50)]
        public string PaymentForm { get; set; } // Tiền mặt / Chuyển khoản
        [Required]
        public DateTime DeliveryPreferredDate { get; set; }
        [Required]
        public DateTime DeliveryExpectedDate { get; set; }

        // --- Installment Info (Nullable) ---
        [Column(TypeName = "decimal(18, 2)")]
        public decimal? DepositAmount { get; set; }
        public int? LoanTermMonths { get; set; }
        [Column(TypeName = "decimal(18, 2)")]
        public decimal? InterestRateYearly { get; set; }

        // --- Status & Timestamps ---
        [Required]
        [StringLength(50)]
        public string Status { get; set; }
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; } = GetVietnamNow(); // Use GetVietnamNow()
        public DateTime UpdatedAt { get; set; } = GetVietnamNow(); // Use GetVietnamNow()

        // --- Navigation Property ---
        public virtual Contract? Contract { get; set; }
    }
}

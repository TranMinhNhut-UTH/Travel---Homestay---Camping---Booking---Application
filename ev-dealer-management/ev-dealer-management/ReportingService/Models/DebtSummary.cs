using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ev_dealer_reporting.Models
{
    public class DebtSummary
    {
        public Guid Id { get; set; }
        public int? DealerId { get; set; } // ID của đại lý (nếu là công nợ đại lý)
        public string? DealerName { get; set; }
        public int? CustomerId { get; set; } // ID của khách hàng (nếu là công nợ khách hàng)
        public string? CustomerName { get; set; }
        public string DebtType { get; set; } = string.Empty; // "DealerToManufacturer" hoặc "CustomerToDealer"
        public string ReferenceType { get; set; } = string.Empty; // "Contract", "Order", "Purchase"
        public string ReferenceId { get; set; } = string.Empty; // ID của Contract, Order, hoặc Purchase
        
        [Column(TypeName = "decimal(18, 2)")]
        public decimal TotalAmount { get; set; } // Tổng số tiền công nợ
        
        [Column(TypeName = "decimal(18, 2)")]
        public decimal OutstandingAmount { get; set; } // Số tiền còn nợ
        public string Status { get; set; } = string.Empty; // "Outstanding", "Paid", "Overdue"
        public DateTime? DueDate { get; set; } // Ngày đáo hạn (nếu có)
        public DateTime CreatedAt { get; set; }
        public DateTime LastUpdatedAt { get; set; }
    }
}

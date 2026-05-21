using System;

namespace CustomerService.DTOs
{
    public class PurchaseDto
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public string Vehicle { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public DateTime PurchaseDate { get; set; }
    }
}

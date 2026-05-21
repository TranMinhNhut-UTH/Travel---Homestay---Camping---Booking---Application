using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ev_dealer_reporting.Services
{
    /// <summary>
    /// Service để fetch dữ liệu từ CustomerService
    /// </summary>
    public interface ICustomerDataService
    {
        // GetPurchasesAsync đã được xóa vì endpoint /api/customers/purchases không tồn tại trong CustomerService
        Task<List<CustomerDataDto>> GetCustomersAsync(int? customerId = null); // To get customer names
    }

    public class PurchaseDataDto
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public string Vehicle { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public DateTime PurchaseDate { get; set; }
    }

    public class CustomerDataDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public int DealerId { get; set; }
    }
}

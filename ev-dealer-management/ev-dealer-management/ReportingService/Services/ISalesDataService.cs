using ev_dealer_reporting.DTOs;

namespace ev_dealer_reporting.Services;

/// <summary>
/// Service để fetch dữ liệu từ SalesService
/// </summary>
public interface ISalesDataService
{
    Task<List<QuoteDataDto>> GetQuotesAsync(DateTime? fromDate, DateTime? toDate, int? dealerId = null);
    Task<List<OrderDataDto>> GetOrdersAsync(DateTime? fromDate, DateTime? toDate, int? dealerId = null);
    Task<List<PaymentDataDto>> GetPaymentsAsync(DateTime? fromDate, DateTime? toDate, int? orderId = null); // Changed orderId to int
    Task<List<ContractDataDto>> GetContractsAsync(DateTime? fromDate, DateTime? toDate, int? dealerId = null);
    Task<OrderDataDto?> GetOrderByIdAsync(int orderId);
}

public class QuoteDataDto
{
    public int QuoteId { get; set; }
    public int DealerId { get; set; }
    public int SalespersonId { get; set; }
    public int CustomerId { get; set; }
    public int VehicleId { get; set; }
    public int Quantity { get; set; }
    public decimal TotalBasePrice { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class OrderDataDto
{
    public int OrderId { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public int DealerId { get; set; }
    public int SalespersonId { get; set; }
    public int CustomerId { get; set; }
    public int VehicleId { get; set; }
    public int Quantity { get; set; }
    public decimal SubTotal { get; set; } // Tổng giá trị đơn hàng trước giảm giá
    public decimal TotalDiscount { get; set; } // Tổng giảm giá
    public decimal TotalPrice { get; set; } // Tổng giá trị đơn hàng sau giảm giá (SubTotal - TotalDiscount)
    public string PaymentMethod { get; set; } = string.Empty; // "Trả thẳng" or "Trả góp"
    public decimal? DepositAmount { get; set; }
    public int? LoanTermMonths { get; set; }
    public decimal? InterestRateYearly { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class PaymentDataDto
{
    public Guid PaymentId { get; set; }
    public int OrderId { get; set; } // Changed from Guid to int
    public decimal Amount { get; set; }
    public string Method { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime? PaidDate { get; set; }
    public DateTime CreatedAt { get; set; }
}

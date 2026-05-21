namespace CustomerService.DTOs
{
    public class CustomerStatsDto
    {
        public int TotalCustomers { get; set; }
        public int ActiveCustomers { get; set; }
        public int InactiveCustomers { get; set; }
        public int NewCustomersLastMonth { get; set; }
        public decimal AveragePurchases { get; set; }
    }
}
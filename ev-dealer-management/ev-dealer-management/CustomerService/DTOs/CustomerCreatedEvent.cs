namespace CustomerService.DTOs
{
    public class CustomerCreatedEvent
    {
        public Guid CustomerId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
    }
}

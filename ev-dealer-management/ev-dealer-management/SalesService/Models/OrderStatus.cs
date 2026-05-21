namespace SalesService.Models
{
    public static class OrderStatus
    {
        public const string Pending = "Pending";
        public const string Active = "Active";
        public const string ContractSigned = "ContractSigned";
        public const string PaymentInProgress = "PaymentInProgress";
        public const string ReadyForDelivery = "ReadyForDelivery";
        public const string Delivering = "Delivering";
        public const string Delivered = "Delivered";
        public const string Cancelled = "Cancelled";
    }
}

using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SalesService.DTOs
{
    public class CreateOrderRequest
    {
        // Fields directly from frontend payload
        [JsonPropertyName("quoteId")]
        public int QuoteId { get; set; }

        [JsonPropertyName("customerId")]
        public int CustomerId { get; set; }

        [JsonPropertyName("customerEmail")]
        public string CustomerEmail { get; set; } = string.Empty;

        [JsonPropertyName("customerName")]
        public string CustomerName { get; set; } = string.Empty;

        [JsonPropertyName("dealerId")]
        public int DealerId { get; set; }

        [JsonPropertyName("salespersonId")]
        public int SalespersonId { get; set; }

        [JsonPropertyName("paymentMethod")]
        public string PaymentMethod { get; set; } = string.Empty; // e.g., "Cash", "Bank transfer"

        [JsonPropertyName("deliveryDate")]
        public DateTime DeliveryDate { get; set; }

        [JsonPropertyName("estimatedDeliveryDate")]
        public DateTime EstimatedDeliveryDate { get; set; }

        [JsonPropertyName("notes")]
        public string? Notes { get; set; }

        [JsonPropertyName("paymentType")]
        public string PaymentType { get; set; } = string.Empty; // e.g., "Full", "Installment"

        [JsonPropertyName("depositAmount")]
        public decimal? DepositAmount { get; set; }

        [JsonPropertyName("interestRateYearly")]
        public decimal? InterestRateYearly { get; set; }

        [JsonPropertyName("loanTermMonths")]
        public int? LoanTermMonths { get; set; }

        [JsonPropertyName("vehicleId")]
        public int VehicleId { get; set; }

        [JsonPropertyName("vehicleVariantId")] // Frontend sends vehicleVariantId, maps to VariantId in Order model
        public int VehicleVariantId { get; set; }

        [JsonPropertyName("colorId")]
        public int ColorId { get; set; }

        [JsonPropertyName("quantity")]
        public int Quantity { get; set; }

        [JsonPropertyName("unitPrice")]
        public decimal UnitPrice { get; set; }

        [JsonPropertyName("totalAmount")] // This is the computedTotal from frontend
        public decimal TotalAmount { get; set; }

        // Promotion fields
        [JsonPropertyName("promotionId")]
        public int? PromotionId { get; set; }

        [JsonPropertyName("discountAmount")]
        public decimal? DiscountAmount { get; set; }

        [JsonPropertyName("discountPercent")]
        public decimal? DiscountPercent { get; set; }

        [JsonPropertyName("discountNote")]
        public string? DiscountNote { get; set; }
    }
}

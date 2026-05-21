using System;
using System.ComponentModel.DataAnnotations;

namespace SalesService.DTOs
{
    public class CreateContractRequest
    {
        [Required]
        public int OrderId { get; set; }

        [Required]
        public int CustomerId { get; set; }

        [Required]
        public string SalespersonId { get; set; }

        [Required]
        public DateTime ContractDate { get; set; }

        public string? TermsAndConditions { get; set; } // Allow null or empty

        public bool DepositAmountReceived { get; set; }
    }
}

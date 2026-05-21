using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ev_dealer_reporting.Models;

public class Dealer
{
    [Key]
    public int Id { get; set; }

    public required string Name { get; set; }
    public string? Address { get; set; }
}

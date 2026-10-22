using System;
using System.Collections.Generic;

namespace InsuranceAPI.Models;

public partial class Policy
{
    public int PolicyId { get; set; }

    public int CustomerId { get; set; }

    public string PolicyType { get; set; } = null!;

    public decimal PremiumAmount { get; set; }

    public DateOnly StartDate { get; set; }

    public DateOnly EndDate { get; set; }

    public string? Status { get; set; }

    public virtual ICollection<Claim> Claims { get; set; } = new List<Claim>();

    public virtual Customer Customer { get; set; } = null!;

    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();
}

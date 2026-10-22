using System;
using System.Collections.Generic;

namespace InsuranceAPI.Models;

public partial class Claim
{
    public int ClaimId { get; set; }

    public int PolicyId { get; set; }

    public DateOnly ClaimDate { get; set; }

    public decimal AmountClaimed { get; set; }

    public string? Status { get; set; }

    public virtual Policy Policy { get; set; } = null!;
}

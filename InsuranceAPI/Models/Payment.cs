using System;
using System.Collections.Generic;

namespace InsuranceAPI.Models;

public partial class Payment
{
    public int PaymentId { get; set; }

    public int PolicyId { get; set; }

    public DateOnly PaymentDate { get; set; }

    public decimal Amount { get; set; }

    public string? PaymentMethod { get; set; }

    public virtual Policy Policy { get; set; } = null!;
}

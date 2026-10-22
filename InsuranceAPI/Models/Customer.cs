using System;
using System.Collections.Generic;


namespace InsuranceAPI.Models;

public partial class Customer
{
    public int CustomerId { get; set; }

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string? Phone { get; set; }
    public string? PasswordHash { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<Policy> Policies { get; set; } = new List<Policy>();
    public string Role { get; set; } = "Customer";
}

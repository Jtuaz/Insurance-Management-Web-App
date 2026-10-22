namespace InsuranceAPI.DTOs;

public class UpdatePolicyRequest
{
    public string PolicyType { get; set; } = null!;

    public decimal PremiumAmount { get; set; }

    public DateOnly StartDate { get; set; }

    public DateOnly EndDate { get; set; }

    public string? Status { get; set; }
}
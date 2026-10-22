namespace InsuranceAPI.DTOs;

public class CreateClaimRequest
{
    public int PolicyId { get; set; }

    public DateOnly ClaimDate { get; set; }

    public decimal AmountClaimed { get; set; }
}
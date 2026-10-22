namespace InsuranceAPI.DTOs;

public class CreatePaymentRequest
{
    public int PolicyId { get; set; }

    public DateOnly PaymentDate { get; set; }

    public decimal Amount { get; set; }

    public string? PaymentMethod { get; set; }
}
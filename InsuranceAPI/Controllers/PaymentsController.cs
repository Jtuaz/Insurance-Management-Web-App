using InsuranceAPI.Data;
using InsuranceAPI.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace InsuranceAPI.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class PaymentsController : ControllerBase
{
    private readonly InsuranceAppContext _context;

    public PaymentsController(InsuranceAppContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetPayments()
    {
        var customerId = GetCustomerId();

        if (customerId == null)
        {
            return Unauthorized();
        }

        var payments = await _context.Payments
            .Where(p => p.Policy.CustomerId == customerId.Value)
            .Select(p => new
            {
                paymentId = p.PaymentId,
                policyId = p.PolicyId,
                paymentDate = p.PaymentDate,
                amount = p.Amount,
                paymentMethod = p.PaymentMethod
            })
            .ToListAsync();

        return Ok(payments);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetPayment(int id)
    {
        var customerId = GetCustomerId();

        if (customerId == null)
        {
            return Unauthorized();
        }

        var payment = await _context.Payments
            .Where(p =>
                p.PaymentId == id &&
                p.Policy.CustomerId == customerId.Value)
            .Select(p => new
            {
                paymentId = p.PaymentId,
                policyId = p.PolicyId,
                paymentDate = p.PaymentDate,
                amount = p.Amount,
                paymentMethod = p.PaymentMethod
            })
            .FirstOrDefaultAsync();

        if (payment == null)
        {
            return NotFound();
        }

        return Ok(payment);
    }

    [HttpPost]
    public async Task<IActionResult> CreatePayment(
        CreatePaymentRequest request)
    {
        var customerId = GetCustomerId();

        if (customerId == null)
        {
            return Unauthorized();
        }

        var policy = await _context.Policies
            .FirstOrDefaultAsync(p =>
                p.PolicyId == request.PolicyId &&
                p.CustomerId == customerId.Value);

        if (policy == null)
        {
            return NotFound(
                "Policy not found or does not belong to this customer.");
        }

        var payment = new Models.Payment
        {
            PolicyId = request.PolicyId,
            PaymentDate = request.PaymentDate,
            Amount = request.Amount,
            PaymentMethod = request.PaymentMethod
        };

        _context.Payments.Add(payment);

        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetPayment),
            new { id = payment.PaymentId },
            new
            {
                paymentId = payment.PaymentId,
                policyId = payment.PolicyId,
                paymentDate = payment.PaymentDate,
                amount = payment.Amount,
                paymentMethod = payment.PaymentMethod
            });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePayment(
        int id,
        CreatePaymentRequest request)
    {
        var customerId = GetCustomerId();

        if (customerId == null)
        {
            return Unauthorized();
        }

        var payment = await _context.Payments
            .FirstOrDefaultAsync(p =>
                p.PaymentId == id &&
                p.Policy.CustomerId == customerId.Value);

        if (payment == null)
        {
            return NotFound();
        }

        payment.PaymentDate = request.PaymentDate;
        payment.Amount = request.Amount;
        payment.PaymentMethod = request.PaymentMethod;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePayment(int id)
    {
        var customerId = GetCustomerId();

        if (customerId == null)
        {
            return Unauthorized();
        }

        var payment = await _context.Payments
            .FirstOrDefaultAsync(p =>
                p.PaymentId == id &&
                p.Policy.CustomerId == customerId.Value);

        if (payment == null)
        {
            return NotFound();
        }

        _context.Payments.Remove(payment);

        await _context.SaveChangesAsync();

        return NoContent();
    }

    private int? GetCustomerId()
    {
        var customerIdClaim = User.FindFirst(
            ClaimTypes.NameIdentifier);

        if (customerIdClaim == null)
        {
            return null;
        }

        if (!int.TryParse(
            customerIdClaim.Value,
            out int customerId))
        {
            return null;
        }

        return customerId;
    }
}
using InsuranceAPI.Data;
using InsuranceAPI.DTOs;
using InsuranceClaim = InsuranceAPI.Models.Claim;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace InsuranceAPI.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ClaimsController : ControllerBase
{
    private readonly InsuranceAppContext _context;

    public ClaimsController(InsuranceAppContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetClaims()
    {
        var customerId = GetCustomerId();

        if (customerId == null)
        {
            return Unauthorized();
        }

        var claims = await _context.Claims
            .Where(c => c.Policy.CustomerId == customerId.Value)
            .Select(c => new
            {
                claimId = c.ClaimId,
                policyId = c.PolicyId,
                claimDate = c.ClaimDate,
                amountClaimed = c.AmountClaimed,
                status = c.Status
            })
            .ToListAsync();

        return Ok(claims);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetClaim(int id)
    {
        var customerId = GetCustomerId();

        if (customerId == null)
        {
            return Unauthorized();
        }

        var claim = await _context.Claims
            .Where(c =>
                c.ClaimId == id &&
                c.Policy.CustomerId == customerId.Value)
            .Select(c => new
            {
                claimId = c.ClaimId,
                policyId = c.PolicyId,
                claimDate = c.ClaimDate,
                amountClaimed = c.AmountClaimed,
                status = c.Status
            })
            .FirstOrDefaultAsync();

        if (claim == null)
        {
            return NotFound();
        }

        return Ok(claim);
    }

    [HttpPost]
    public async Task<IActionResult> CreateClaim(
        CreateClaimRequest request)
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

        var claim = new InsuranceClaim
        {
            PolicyId = request.PolicyId,
            ClaimDate = request.ClaimDate,
            AmountClaimed = request.AmountClaimed,
            Status = "Pending"
        };

        _context.Claims.Add(claim);

        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetClaim),
            new { id = claim.ClaimId },
            new
            {
                claimId = claim.ClaimId,
                policyId = claim.PolicyId,
                claimDate = claim.ClaimDate,
                amountClaimed = claim.AmountClaimed,
                status = claim.Status
            });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateClaim(
        int id,
        UpdateClaimRequest request)
    {
        var customerId = GetCustomerId();

        if (customerId == null)
        {
            return Unauthorized();
        }

        var existingClaim = await _context.Claims
            .Include(c => c.Policy)
            .FirstOrDefaultAsync(c =>
                c.ClaimId == id &&
                c.Policy.CustomerId == customerId.Value);

        if (existingClaim == null)
        {
            return NotFound();
        }

        existingClaim.ClaimDate =
            request.ClaimDate;

        existingClaim.AmountClaimed =
            request.AmountClaimed;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteClaim(int id)
    {
        var customerId = GetCustomerId();

        if (customerId == null)
        {
            return Unauthorized();
        }

        var existingClaim = await _context.Claims
            .Include(c => c.Policy)
            .FirstOrDefaultAsync(c =>
                c.ClaimId == id &&
                c.Policy.CustomerId == customerId.Value);

        if (existingClaim == null)
        {
            return NotFound();
        }

        _context.Claims.Remove(existingClaim);

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
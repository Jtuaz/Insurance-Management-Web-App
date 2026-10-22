using InsuranceAPI.Data;
using InsuranceAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using InsuranceAPI.DTOs;

namespace InsuranceAPI.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class PoliciesController : ControllerBase
{
    private readonly InsuranceAppContext _context;

    public PoliciesController(InsuranceAppContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Policy>>> GetPolicies()
    {
        var customerId = GetCustomerId();

        if (customerId == null)
        {
            return Unauthorized();
        }

        var policies = await _context.Policies
            .Where(p => p.CustomerId == customerId.Value)
            .ToListAsync();

        return Ok(policies);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Policy>> GetPolicy(int id)
    {
        var customerId = GetCustomerId();

        if (customerId == null)
        {
            return Unauthorized();
        }

        var policy = await _context.Policies
            .FirstOrDefaultAsync(p =>
                p.PolicyId == id &&
                p.CustomerId == customerId.Value);

        if (policy == null)
        {
            return NotFound();
        }

        return Ok(policy);
    }

    [HttpPost]
    public async Task<ActionResult<Policy>> CreatePolicy(CreatePolicyRequest request)
    {
        var customerId = GetCustomerId();

        if (customerId == null)
        {
            return Unauthorized();
        }

        var policy = new Policy
        {
            CustomerId = customerId.Value,
            PolicyType = request.PolicyType,
            PremiumAmount = request.PremiumAmount,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            Status = request.Status
        };

        _context.Policies.Add(policy);

        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetPolicy),
            new { id = policy.PolicyId },
            policy);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePolicy(
        int id,
        UpdatePolicyRequest request)
    {
        var customerId = GetCustomerId();

        if (customerId == null)
        {
            return Unauthorized();
        }

        var existingPolicy = await _context.Policies
            .FirstOrDefaultAsync(p =>
                p.PolicyId == id &&
                p.CustomerId == customerId.Value);

        if (existingPolicy == null)
        {
            return NotFound();
        }

        existingPolicy.PolicyType =
            request.PolicyType;

        existingPolicy.PremiumAmount =
            request.PremiumAmount;

        existingPolicy.StartDate =
            request.StartDate;

        existingPolicy.EndDate =
            request.EndDate;

        existingPolicy.Status =
            request.Status;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePolicy(int id)
    {
        var customerId = GetCustomerId();

        if (customerId == null)
        {
            return Unauthorized();
        }

        var policy = await _context.Policies
            .FirstOrDefaultAsync(p =>
                p.PolicyId == id &&
                p.CustomerId == customerId.Value);

        if (policy == null)
        {
            return NotFound();
        }

        _context.Policies.Remove(policy);

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
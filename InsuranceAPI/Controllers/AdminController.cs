using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using InsuranceAPI.DTOs;
using InsuranceAPI.Data;

namespace InsuranceAPI.Controllers;

[Authorize(Roles = "Admin")]
[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly InsuranceAppContext _context;

    public AdminController(InsuranceAppContext context)
    {
        _context = context;
    }

    // GET: /api/Admin/test
    // Confirms that admin authorization is working.
    [HttpGet("test")]
    public IActionResult Test()
    {
        return Ok(new
        {
            message = "Admin authorization successful!",
            role = "Admin"
        });
    }

    // GET: /api/Admin/claims
    // Returns claims belonging to all customers.
    [HttpGet("claims")]
    public async Task<IActionResult> GetAllClaims()
    {
        var claims = await _context.Claims
            .Select(c => new
            {
                claimId = c.ClaimId,
                policyId = c.PolicyId,
                claimDate = c.ClaimDate,
                amountClaimed = c.AmountClaimed,
                status = c.Status,

                customerId = c.Policy.CustomerId,

                customerFirstName =
                    c.Policy.Customer.FirstName,

                customerLastName =
                    c.Policy.Customer.LastName,

                customerEmail =
                    c.Policy.Customer.Email,

                policyType =
                    c.Policy.PolicyType
            })
            .ToListAsync();

        return Ok(claims);
    }
        
    // PATCH: /api/Admin/claims/{id}/status
    // Allows admins to approve or reject pending claims.
    [HttpPatch("claims/{id}/status")]
    public async Task<IActionResult> UpdateClaimStatus(
        int id,
        UpdateClaimStatusRequest request)
    {
        // Only these two decisions are permitted.
        if (
            request.Status != "Approved" &&
            request.Status != "Rejected")
        {
            return BadRequest(
                "Status must be Approved or Rejected.");
        }

        // Find the claim by its ID.
        var claim = await _context.Claims
            .FirstOrDefaultAsync(c => c.ClaimId == id);

        if (claim == null)
        {
            return NotFound("Claim not found.");
        }

        // Prevent a previously reviewed claim from being
        // approved or rejected again through this endpoint.
        if (claim.Status != "Pending")
        {
            return Conflict(
                "Only pending claims can be reviewed.");
        }

        // Save the admin's decision.
        claim.Status = request.Status;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Claim status updated successfully.",
            claimId = claim.ClaimId,
            status = claim.Status
        });
    }

}


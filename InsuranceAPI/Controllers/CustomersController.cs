
using InsuranceAPI.Data;
using InsuranceAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace InsuranceAPI.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class CustomersController : ControllerBase
{
    private readonly InsuranceAppContext _context;

    public CustomersController(InsuranceAppContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Customer>>> GetCustomers()
    {
        return await _context.Customers.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetCustomer(int id)
    {
        var customer = await _context.Customers
            .Where(c => c.CustomerId == id)
            .Select(c => new
            {
                customerId = c.CustomerId,
                firstName = c.FirstName,
                lastName = c.LastName,
                email = c.Email,
                phone = c.Phone,
                createdAt = c.CreatedAt
            })
            .FirstOrDefaultAsync();

        if (customer == null)
        {
            return NotFound();
        }

        return Ok(customer);
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetMyProfile()
    {
        var customerIdValue =
            User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!int.TryParse(customerIdValue, out var customerId))
        {
            return Unauthorized();
        }

        var customer = await _context.Customers
            .Where(c => c.CustomerId == customerId)
            .Select(c => new
            {
                customerId = c.CustomerId,
                firstName = c.FirstName,
                lastName = c.LastName,
                email = c.Email,
                phone = c.Phone,
                createdAt = c.CreatedAt
            })
            .FirstOrDefaultAsync();

        if (customer == null)
        {
            return NotFound("Customer profile not found.");
        }

        return Ok(customer);
    }

    [HttpPut("me")]
    public async Task<IActionResult> UpdateMyProfile(
        UpdateCustomerProfileRequest request)
    {
        var customerIdValue =
            User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!int.TryParse(customerIdValue, out var customerId))
        {
            return Unauthorized();
        }

        var customer = await _context.Customers
            .FirstOrDefaultAsync(c => c.CustomerId == customerId);

        if (customer == null)
        {
            return NotFound("Customer profile not found.");
        }

        var email = request.Email.Trim();

        var emailExists = await _context.Customers
            .AnyAsync(c =>
                c.CustomerId != customerId &&
                c.Email.ToLower() == email.ToLower());

        if (emailExists)
        {
            return Conflict("That email address is already in use.");
        }

        customer.FirstName = request.FirstName.Trim();
        customer.LastName = request.LastName.Trim();
        customer.Email = email;
        customer.Phone = string.IsNullOrWhiteSpace(request.Phone)
            ? null
            : request.Phone.Trim();

        await _context.SaveChangesAsync();

        return Ok(new
        {
            customerId = customer.CustomerId,
            firstName = customer.FirstName,
            lastName = customer.LastName,
            email = customer.Email,
            phone = customer.Phone,
            createdAt = customer.CreatedAt
        });
    }

    [HttpPost]
    public async Task<ActionResult<Customer>> CreateCustomer(
        Customer customer)
    {
        _context.Customers.Add(customer);

        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetCustomer),
            new { id = customer.CustomerId },
            customer);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCustomer(
        int id,
        Customer customer)
    {
        if (id != customer.CustomerId)
        {
            return BadRequest();
        }

        _context.Entry(customer).State = EntityState.Modified;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCustomer(int id)
    {
        var customer = await _context.Customers
            .FirstOrDefaultAsync(c => c.CustomerId == id);

        if (customer == null)
        {
            return NotFound();
        }

        _context.Customers.Remove(customer);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}

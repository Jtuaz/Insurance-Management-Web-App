using InsuranceAPI.Data;
using InsuranceAPI.Models;
using InsuranceAPI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace InsuranceAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly InsuranceAppContext _context;
    private readonly TokenService _tokenService;
    private readonly PasswordHasher<Customer> _passwordHasher;

    public AuthController(
        InsuranceAppContext context,
        TokenService tokenService)
    {
        _context = context;
        _tokenService = tokenService;
        _passwordHasher = new PasswordHasher<Customer>();
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(
        string firstName,
        string lastName,
        string email,
        string password,
        string? phone)
    {
        var existingCustomer = await _context.Customers
            .FirstOrDefaultAsync(c => c.Email == email);

        if (existingCustomer != null)
        {
            return Conflict("A customer with this email already exists.");
        }

        var customer = new Customer
        {
            FirstName = firstName,
            LastName = lastName,
            Email = email,
            Phone = phone
        };

        customer.PasswordHash = _passwordHasher.HashPassword(
            customer,
            password);

        _context.Customers.Add(customer);

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Customer registered successfully.",
            customerId = customer.CustomerId
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(
        string email,
        string password)
    {
        var customer = await _context.Customers
            .FirstOrDefaultAsync(c => c.Email == email);

        if (customer == null)
        {
            return Unauthorized("Invalid email or password.");
        }

        if (string.IsNullOrEmpty(customer.PasswordHash))
        {
            return Unauthorized("This account does not have a password set.");
        }

        var passwordResult = _passwordHasher.VerifyHashedPassword(
            customer,
            customer.PasswordHash,
            password);

        if (passwordResult == PasswordVerificationResult.Failed)
        {
            return Unauthorized("Invalid email or password.");
        }

        var token = _tokenService.CreateToken(
            customer.Email,
            customer.CustomerId,
            customer.Role);

        return Ok(new
        {
            token,
            customerId = customer.CustomerId,
            email = customer.Email,
            firstName = customer.FirstName,
            lastName = customer.LastName
        });
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword(
        string email,
        string newPassword)
    {
        var customer = await _context.Customers
            .FirstOrDefaultAsync(c => c.Email == email);

        if (customer == null)
        {
            return NotFound("Customer not found.");
        }

        customer.PasswordHash = _passwordHasher.HashPassword(
            customer,
            newPassword);

        await _context.SaveChangesAsync();

        return Ok("Password reset successfully.");
    }
}
using System;
using System.Collections.Generic;
using InsuranceAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace InsuranceAPI.Data;

public partial class InsuranceAppContext : DbContext
{
    public InsuranceAppContext(DbContextOptions<InsuranceAppContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Claim> Claims { get; set; }

    public virtual DbSet<Customer> Customers { get; set; }

    public virtual DbSet<Payment> Payments { get; set; }

    public virtual DbSet<Policy> Policies { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Claim>(entity =>
        {
            entity.HasKey(e => e.ClaimId).HasName("PK__claims__F9CC0896F81928B7");

            entity.ToTable("claims");

            entity.Property(e => e.ClaimId).HasColumnName("claim_id");
            entity.Property(e => e.AmountClaimed)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("amount_claimed");
            entity.Property(e => e.ClaimDate).HasColumnName("claim_date");
            entity.Property(e => e.PolicyId).HasColumnName("policy_id");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasDefaultValue("Pending")
                .HasColumnName("status");

            entity.HasOne(d => d.Policy).WithMany(p => p.Claims)
                .HasForeignKey(d => d.PolicyId)
                .HasConstraintName("FK_claims_policies");
        });

        modelBuilder.Entity<Customer>(entity =>
        {
            entity.HasKey(e => e.CustomerId).HasName("PK__customer__CD65CB852C04DE03");

            entity.ToTable("customers");

            entity.HasIndex(e => e.Email, "UQ__customer__AB6E6164FA772756").IsUnique();

            entity.Property(e => e.CustomerId).HasColumnName("customer_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("email");
            entity.Property(e => e.FirstName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("first_name");
            entity.Property(e => e.LastName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("last_name");
            entity.Property(e => e.Phone)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("phone");

            entity.Property(e => e.PasswordHash)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("password_hash");
        });

        modelBuilder.Entity<Payment>(entity =>
        {
            entity.HasKey(e => e.PaymentId).HasName("PK__payments__ED1FC9EA95CB565B");

            entity.ToTable("payments");

            entity.Property(e => e.PaymentId).HasColumnName("payment_id");
            entity.Property(e => e.Amount)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("amount");
            entity.Property(e => e.PaymentDate).HasColumnName("payment_date");
            entity.Property(e => e.PaymentMethod)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("payment_method");
            entity.Property(e => e.PolicyId).HasColumnName("policy_id");

            entity.HasOne(d => d.Policy).WithMany(p => p.Payments)
                .HasForeignKey(d => d.PolicyId)
                .HasConstraintName("FK_payments_policies");
        });

        modelBuilder.Entity<Policy>(entity =>
        {
            entity.HasKey(e => e.PolicyId).HasName("PK__policies__47DA3F03979AF55A");

            entity.ToTable("policies");

            entity.Property(e => e.PolicyId).HasColumnName("policy_id");
            entity.Property(e => e.CustomerId).HasColumnName("customer_id");
            entity.Property(e => e.EndDate).HasColumnName("end_date");
            entity.Property(e => e.PolicyType)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("policy_type");
            entity.Property(e => e.PremiumAmount)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("premium_amount");
            entity.Property(e => e.StartDate).HasColumnName("start_date");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasDefaultValue("Active")
                .HasColumnName("status");

            entity.HasOne(d => d.Customer).WithMany(p => p.Policies)
                .HasForeignKey(d => d.CustomerId)
                .HasConstraintName("FK_policies_customers");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}

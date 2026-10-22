import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { Auth } from '../../services/auth';
import { ClaimsService } from '../../services/claims';
import { PoliciesService, Policy } from '../../services/policies';
import { Claim, CreateClaimRequest } from '../../models/claim';

@Component({
  selector: 'app-claims',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, RouterLink, FormsModule],
  templateUrl: './claims.html',
  styleUrl: './claims.css'
})
export class Claims implements OnInit {
  claims: Claim[] = [];
  policies: Policy[] = [];

  isLoading = true;
  isSubmitting = false;
  showClaimForm = false;

  errorMessage = '';
  successMessage = '';
  formError = '';

  policyId: number | null = null;
  claimDate = new Date().toISOString().split('T')[0];
  amountClaimed: number | null = null;

  constructor(
    private claimsService: ClaimsService,
    private policiesService: PoliciesService,
    private auth: Auth,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadClaims();
    this.loadPolicies();
  }

  loadClaims(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.claimsService.getClaims().subscribe({
      next: (claims) => {
        this.claims = claims;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.isLoading = false;

        if (error.status === 401 || error.status === 403) {
          this.errorMessage =
            'Your session may have expired. Please log in again.';
        } else {
          this.errorMessage =
            'Unable to load your claims. Please try again.';
        }

        console.error('Claims request failed:', error);
        this.cdr.detectChanges();
      }
    });
  }

  loadPolicies(): void {
    this.policiesService.getPolicies().subscribe({
      next: (policies) => {
        this.policies = policies;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Policies request failed:', error);
        this.formError =
          'Unable to load your policies. Please try again later.';
        this.cdr.detectChanges();
      }
    });
  }

  toggleClaimForm(): void {
    this.showClaimForm = !this.showClaimForm;
    this.formError = '';
    this.successMessage = '';
  }

  submitClaim(): void {
    this.formError = '';
    this.successMessage = '';

    if (
      this.policyId === null ||
      !this.claimDate ||
      this.amountClaimed === null ||
      !Number.isFinite(this.amountClaimed) ||
      this.amountClaimed <= 0
    ) {
      this.formError =
        'Select a policy, enter a claim date, and enter an amount greater than zero.';
      return;
    }

    const request: CreateClaimRequest = {
      policyId: this.policyId,
      claimDate: this.claimDate,
      amountClaimed: this.amountClaimed
    };

    this.isSubmitting = true;

    this.claimsService.createClaim(request).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.successMessage =
          'Your claim was submitted successfully and is pending review.';
        this.showClaimForm = false;
        this.policyId = null;
        this.claimDate = new Date().toISOString().split('T')[0];
        this.amountClaimed = null;

        this.loadClaims();
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.isSubmitting = false;
        this.formError =
          error.status === 401 || error.status === 403
            ? 'Your session may have expired. Please log in again.'
            : 'Unable to submit your claim. Please check your information and try again.';

        console.error('Claim submission failed:', error);
        this.cdr.detectChanges();
      }
    });
  }

  logout(): void {
    this.auth.logout();
    localStorage.removeItem('customerFirstName');
    localStorage.removeItem('customerId');
    localStorage.removeItem('customerEmail');
    this.router.navigate(['/login']);
  }
}

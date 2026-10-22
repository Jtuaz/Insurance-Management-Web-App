import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  AdminClaimsService,
  AdminClaim
} from '../../services/admin-claims';

@Component({
  selector: 'app-admin-claims',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-claims.html',
  styleUrl: './admin-claims.css'
})
export class AdminClaims implements OnInit {
  claims: AdminClaim[] = [];

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  // Track the claim currently being reviewed.
  updatingClaimId: number | null = null;

  constructor(
    private adminClaimsService: AdminClaimsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadClaims();
  }

  loadClaims(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.adminClaimsService.getAllClaims().subscribe({
      next: (data: AdminClaim[]) => {
        this.claims = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading claims:', error);

        this.errorMessage =
          error.status === 401 || error.status === 403
            ? 'You are not authorized to view all claims.'
            : 'Unable to load claims. Make sure the API is running and you are logged in as an admin.';

        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  reviewClaim(
    claim: AdminClaim,
    status: 'Approved' | 'Rejected'
  ): void {
    if (claim.status !== 'Pending' || this.updatingClaimId !== null) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';
    this.updatingClaimId = claim.claimId;

    this.adminClaimsService
      .updateClaimStatus(claim.claimId, status)
      .subscribe({
        next: (response) => {
          // Update the displayed status after the API confirms success.
          claim.status = response.status;

          this.successMessage =
            `Claim #${claim.claimId} has been ${status.toLowerCase()}.`;

          this.updatingClaimId = null;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error updating claim status:', error);

          this.errorMessage =
            error.error?.message ??
            (typeof error.error === 'string' ? error.error : null) ??
            'Unable to update the claim status. Please try again.';

          this.updatingClaimId = null;
          this.cdr.detectChanges();
        }
      });
  }
}

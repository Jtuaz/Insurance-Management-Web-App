
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  AdminClaim,
  AdminClaimsService
} from '../../services/admin-claims';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-admin-claims',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-claims.html',
  styleUrl: './admin-claims.css'
})
export class AdminClaims implements OnInit {
  claims: AdminClaim[] = [];

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  updatingClaimIds = new Set<number>();

  adminName = 'Administrator';
  adminEmail = '';

  constructor(
    private adminClaimsService: AdminClaimsService,
    private auth: Auth,
    private router: Router,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.adminName =
      localStorage.getItem('customerFirstName') || 'Administrator';

    this.adminEmail =
      localStorage.getItem('customerEmail') || '';

    this.loadClaims();
  }

  loadClaims(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.adminClaimsService.getAllClaims().subscribe({
      next: (claims: AdminClaim[]) => {
        this.claims = claims;
        this.isLoading = false;
        this.changeDetector.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;

        if (error.status === 401) {
          this.errorMessage =
            'Your session has expired or your login is invalid. Please log in again.';
        } else if (error.status === 403) {
          this.errorMessage =
            'Access denied. This page requires an administrator account.';
        } else {
          this.errorMessage =
            'Unable to load claims. Make sure the backend API is running.';
        }

        this.changeDetector.detectChanges();
      }
    });
  }

  get pendingCount(): number {
    return this.claims.filter(
      claim => claim.status?.toLowerCase() === 'pending'
    ).length;
  }

  get approvedCount(): number {
    return this.claims.filter(
      claim => claim.status?.toLowerCase() === 'approved'
    ).length;
  }

  get rejectedCount(): number {
    return this.claims.filter(
      claim => claim.status?.toLowerCase() === 'rejected'
    ).length;
  }

  reviewClaim(
    claim: AdminClaim,
    status: 'Approved' | 'Rejected'
  ): void {
    if (claim.status?.toLowerCase() !== 'pending') {
      return;
    }

    const action = status.toLowerCase();

    if (
      !confirm(
        `Are you sure you want to ${action} claim #${claim.claimId}?`
      )
    ) {
      return;
    }

    this.updatingClaimIds.add(claim.claimId);
    this.errorMessage = '';
    this.successMessage = '';

    this.adminClaimsService
      .updateClaimStatus(claim.claimId, status)
      .subscribe({
        next: response => {
          claim.status = response.status;

          this.successMessage =
            `Claim #${claim.claimId} was ${status.toLowerCase()} successfully.`;

          this.updatingClaimIds.delete(claim.claimId);
          this.changeDetector.detectChanges();
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 409) {
            this.errorMessage =
              'This claim has already been reviewed. Refresh the list to see its current status.';
          } else if (error.status === 401) {
            this.errorMessage =
              'Your session is no longer valid. Please log in again.';
          } else if (error.status === 403) {
            this.errorMessage =
              'You are not authorized to review claims.';
          } else {
            this.errorMessage =
              `Unable to update claim #${claim.claimId}. Please try again.`;
          }

          this.updatingClaimIds.delete(claim.claimId);
          this.changeDetector.detectChanges();
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

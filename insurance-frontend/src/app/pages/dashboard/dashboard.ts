
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PoliciesService, Policy } from '../../services/policies';
import { ClaimsService } from '../../services/claims';
import { Claim } from '../../models/claim';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  customerName = 'Customer';

  policies: Policy[] = [];
  claims: Claim[] = [];

  isLoadingPolicies = true;
  isLoadingClaims = true;

  policiesError = '';
  claimsError = '';

  constructor(
    private auth: Auth,
    private router: Router,
    private policiesService: PoliciesService,
    private claimsService: ClaimsService,
    private cdr: ChangeDetectorRef
  ) {
    const storedName = localStorage.getItem('customerFirstName');

    if (storedName) {
      this.customerName = storedName;
    }
  }

  ngOnInit(): void {
    this.loadPolicies();
    this.loadClaims();
  }

  loadPolicies(): void {
    this.isLoadingPolicies = true;
    this.policiesError = '';

    this.policiesService.getPolicies().subscribe({
      next: (policies: Policy[]) => {
        console.log('Dashboard policies response:', policies);

        this.policies = policies;
        this.isLoadingPolicies = false;
        this.cdr.detectChanges();

        console.log('Policies loading:', this.isLoadingPolicies);
        console.log('Policy count:', this.policies.length);
      },
      error: (error) => {
        console.error('Unable to load dashboard policies:', error);
        this.policiesError =
          'Unable to load policies. Please try again later.';
        this.isLoadingPolicies = false;
      }
    });
  }

  loadClaims(): void {
    this.isLoadingClaims = true;
    this.claimsError = '';

    this.claimsService.getClaims().subscribe({
      next: (claims: Claim[]) => {
        console.log('Dashboard claims response:', claims);

        this.claims = claims;
        this.isLoadingClaims = false;
        this.cdr.detectChanges();
        
        console.log('Claims loading:', this.isLoadingClaims);
        console.log('Claim count:', this.claims.length);
      },
      error: (error) => {
        console.error('Unable to load dashboard claims:', error);
        this.claimsError =
          'Unable to load claims. Please try again later.';
        this.isLoadingClaims = false;
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


import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';
import {
  PoliciesService,
  Policy,
  CreatePolicyRequest
} from '../../services/policies';

@Component({
  selector: 'app-policies',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, FormsModule, RouterLink],
  templateUrl: './policies.html',
  styleUrl: './policies.css'
})
export class Policies implements OnInit {
  policies: Policy[] = [];

  isLoading = true;
  isCreating = false;
  showCreateForm = false;

  errorMessage = '';
  formError = '';
  successMessage = '';

  policyType = 'Auto';
  premiumAmount: number | null = null;
  startDate = this.getToday();
  endDate = this.getOneYearFromToday();

  constructor(
    private policiesService: PoliciesService,
    private auth: Auth,
    private router: Router,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadPolicies();
  }

  loadPolicies(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.policiesService.getPolicies().subscribe({
      next: (policies) => {
        this.policies = policies;
        this.isLoading = false;
        this.changeDetector.detectChanges();
      },
      error: (error) => {
        this.isLoading = false;

        if (error.status === 401 || error.status === 403) {
          this.errorMessage =
            'Your session may have expired. Please log in again.';
        } else {
          this.errorMessage =
            'Unable to load your policies. Please try again.';
        }

        console.error('Policies request failed:', error);
        this.changeDetector.detectChanges();
      }
    });
  }

  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
    this.formError = '';
    this.successMessage = '';
  }

  createPolicy(): void {
    this.formError = '';
    this.successMessage = '';

    if (
      this.premiumAmount === null ||
      !Number.isFinite(this.premiumAmount) ||
      this.premiumAmount <= 0
    ) {
      this.formError = 'Enter a premium amount greater than zero.';
      return;
    }

    if (!this.startDate || !this.endDate || this.endDate <= this.startDate) {
      this.formError = 'The end date must be after the start date.';
      return;
    }

    const request: CreatePolicyRequest = {
      policyType: this.policyType,
      premiumAmount: this.premiumAmount,
      startDate: this.startDate,
      endDate: this.endDate,
      status: 'Active'
    };

    this.isCreating = true;

    this.policiesService.createPolicy(request).subscribe({
      next: (createdPolicy) => {
        this.policies = [...this.policies, createdPolicy];
        this.isCreating = false;
        this.showCreateForm = false;
        this.successMessage =
          `Your ${createdPolicy.policyType} policy was created successfully.`;

        this.resetForm();
        this.changeDetector.detectChanges();
      },
      error: (error) => {
        this.isCreating = false;

        if (error.status === 401 || error.status === 403) {
          this.formError =
            'Your session may have expired. Please log in again.';
        } else {
          this.formError =
            'Unable to create your policy. Please check your information and try again.';
        }

        console.error('Policy creation failed:', error);
        this.changeDetector.detectChanges();
      }
    });
  }

  resetForm(): void {
    this.policyType = 'Auto';
    this.premiumAmount = null;
    this.startDate = this.getToday();
    this.endDate = this.getOneYearFromToday();
  }

  private getToday(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  private getOneYearFromToday(): string {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  logout(): void {
    this.auth.logout();
    localStorage.removeItem('customerFirstName');
    localStorage.removeItem('customerId');
    localStorage.removeItem('customerEmail');
    this.router.navigate(['/login']);
  }
}

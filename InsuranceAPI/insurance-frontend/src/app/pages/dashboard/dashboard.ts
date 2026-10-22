import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { Policy } from '../../services/policy';
import { PolicyModel } from '../../models/policy';

import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [CurrencyPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  policies: PolicyModel[] = [];

  errorMessage: string = '';

  constructor(
    private policyService: Policy,
    private cdr: ChangeDetectorRef // 1. Inject ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadPolicies();
  }

  loadPolicies(): void {
    this.policyService.getPolicies().subscribe({
      next: (response) => {
        console.log('Policies received:', response);
        console.log('Number of policies:', response.length);

        this.policies = response;

        console.log('Dashboard policies:', this.policies);

        // 2. Force Angular to update the HTML immediately
        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Policy error:', error);

        this.errorMessage = 'Unable to load your policies.';

        // Ensure error state updates in HTML as well
        this.cdr.detectChanges();
      }
    });
  }
}
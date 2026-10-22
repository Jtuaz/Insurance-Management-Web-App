import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { Payment } from '../../services/payment';
import { PaymentModel } from '../../models/payment';

@Component({
  selector: 'app-payments',
  imports: [],
  templateUrl: './payments.html',
  styleUrl: './payments.css'
})
export class Payments implements OnInit {

  payments: PaymentModel[] = [];

  errorMessage: string = '';

  constructor(
    private paymentService: Payment,
    private cdr: ChangeDetectorRef // 1. Inject ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments(): void {
    this.paymentService.getPayments().subscribe({
      next: (response) => {
        console.log('Payments received:', response);
        console.log('Number of payments:', response.length);

        this.payments = response;

        // 2. Force Angular to update the HTML template immediately
        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Payment error:', error);

        this.errorMessage = 'Unable to load your payments.';

        // Ensure error state updates in HTML as well
        this.cdr.detectChanges();
      }
    });
  }
}
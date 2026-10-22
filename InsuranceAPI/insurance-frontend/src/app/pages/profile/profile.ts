import {
    Component,
    OnInit,
    ChangeDetectorRef
} from '@angular/core';

import { Customer } from '../../services/customer';
import { CustomerModel } from '../../models/customer';
import { Auth } from '../../services/auth';

@Component({
    selector: 'app-profile',
    imports: [],
    templateUrl: './profile.html',
    styleUrl: './profile.css'
})
export class Profile implements OnInit {

    customer: CustomerModel | null = null;

    errorMessage: string = '';

    constructor(
        private customerService: Customer,
        private auth: Auth,
        private cdr: ChangeDetectorRef
    ) {
    }

    ngOnInit(): void {
        this.loadProfile();
    }

    loadProfile(): void {

        const token = this.auth.getToken();

        if (!token) {

            this.errorMessage =
                'You are not logged in.';

            this.cdr.detectChanges();

            return;
        }

        const customerId = this.getCustomerIdFromToken(token);

        if (customerId === null) {

            this.errorMessage =
                'Unable to determine your customer ID.';

            this.cdr.detectChanges();

            return;
        }

        this.customerService
            .getCustomer(customerId)
            .subscribe({

                next: (response) => {

                    console.log(
                        'Customer received:',
                        response
                    );

                    this.customer = response;

                    this.cdr.detectChanges();
                },

                error: (error) => {

                    console.error(
                        'Profile error:',
                        error
                    );

                    this.errorMessage =
                        'Unable to load your profile.';

                    this.cdr.detectChanges();
                }
            });
    }

  private getCustomerIdFromToken(
      token: string
  ): number | null {

      try {

          const payload = token.split('.')[1];

          const decodedPayload =
              JSON.parse(atob(payload));

          console.log(
              'Decoded JWT payload:',
              decodedPayload
          );

          const customerId =
              decodedPayload[
                  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
              ];

          if (!customerId) {
              return null;
          }

          const parsedCustomerId =
              Number(customerId);

          if (Number.isNaN(parsedCustomerId)) {
              return null;
          }

          return parsedCustomerId;

      }
      catch (error) {

          console.error(
              'Unable to decode JWT:',
              error
          );

          return null;
      }
  }
}
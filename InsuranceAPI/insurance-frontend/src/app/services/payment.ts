import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { PaymentModel } from '../models/payment';

@Injectable({
    providedIn: 'root'
})
export class Payment {

    private apiUrl = 'http://localhost:5042/api/Payments';

    constructor(private http: HttpClient) {
    }

    getPayments(): Observable<PaymentModel[]> {

        return this.http.get<PaymentModel[]>(
            this.apiUrl
        );
    }
}
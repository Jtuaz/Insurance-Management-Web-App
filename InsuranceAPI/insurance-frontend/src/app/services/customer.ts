import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { CustomerModel } from '../models/customer';

@Injectable({
    providedIn: 'root'
})
export class Customer {

    private apiUrl = 'http://localhost:5042/api/Customers';

    constructor(private http: HttpClient) {
    }

    getCustomer(customerId: number): Observable<CustomerModel> {

        return this.http.get<CustomerModel>(
            `${this.apiUrl}/${customerId}`
        );
    }
}
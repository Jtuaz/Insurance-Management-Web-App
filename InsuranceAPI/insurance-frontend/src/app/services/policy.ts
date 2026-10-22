import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { PolicyModel } from '../models/policy';

@Injectable({
    providedIn: 'root'
})
export class Policy {

    private apiUrl =
        'http://localhost:5042/api/Policies';

    constructor(
        private http: HttpClient
    ) {
    }

    getPolicies(): Observable<PolicyModel[]> {

        return this.http.get<PolicyModel[]>(
            this.apiUrl
        );
    }

    getPolicy(
        policyId: number
    ): Observable<PolicyModel> {

        return this.http.get<PolicyModel>(
            `${this.apiUrl}/${policyId}`
        );
    }

    createPolicy(
        policy: {
            policyType: string;
            premiumAmount: number;
            startDate: string;
            endDate: string;
            status: string;
        }
    ): Observable<PolicyModel> {

        return this.http.post<PolicyModel>(
            this.apiUrl,
            policy
        );
    }

    updatePolicy(
        policyId: number,
        policy: {
            policyType: string;
            premiumAmount: number;
            startDate: string;
            endDate: string;
            status: string;
        }
    ): Observable<void> {

        return this.http.put<void>(
            `${this.apiUrl}/${policyId}`,
            policy
        );
    }
    deletePolicy(
        policyId: number
    ): Observable<void> {

        return this.http.delete<void>(
            `${this.apiUrl}/${policyId}`
        );
    }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ClaimModel } from '../models/claim';

@Injectable({
    providedIn: 'root'
})
export class Claim {

    private apiUrl =
        'http://localhost:5042/api/Claims';

    constructor(
        private http: HttpClient
    ) {
    }

    getClaims(): Observable<ClaimModel[]> {

        return this.http.get<ClaimModel[]>(
            this.apiUrl
        );
    }

    getClaim(
        claimId: number
    ): Observable<ClaimModel> {

        return this.http.get<ClaimModel>(
            `${this.apiUrl}/${claimId}`
        );
    }

    createClaim(
        claim: {
            policyId: number;
            claimDate: string;
            amountClaimed: number;
        }
    ): Observable<ClaimModel> {

        return this.http.post<ClaimModel>(
            this.apiUrl,
            claim
        );
    }

    updateClaim(
        claimId: number,
        claim: {
            claimDate: string;
            amountClaimed: number;
        }
    ): Observable<void> {

        return this.http.put<void>(
            `${this.apiUrl}/${claimId}`,
            claim
        );
    }

    deleteClaim(
        claimId: number
    ): Observable<void> {

        return this.http.delete<void>(
            `${this.apiUrl}/${claimId}`
        );
    }
}
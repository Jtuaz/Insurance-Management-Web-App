
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Represents one claim returned by GET /api/Admin/claims.
export interface AdminClaim {
  claimId: number;
  policyId: number;
  claimDate: string;
  amountClaimed: number;
  status: string;
  customerId: number;
  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
  policyType: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminClaimsService {
  private readonly apiUrl = 'http://localhost:5042/api/Admin';

  constructor(private http: HttpClient) {}

  // Retrieve claims belonging to all customers.
  getAllClaims(): Observable<AdminClaim[]> {
    return this.http.get<AdminClaim[]>(
      `${this.apiUrl}/claims`
    );
  }

  // Approve or reject a pending claim.
  updateClaimStatus(
    claimId: number,
    status: 'Approved' | 'Rejected'
  ): Observable<{
    message: string;
    claimId: number;
    status: string;
  }> {
    return this.http.patch<{
      message: string;
      claimId: number;
      status: string;
    }>(
      `${this.apiUrl}/claims/${claimId}/status`,
      { status }
    );
  }
}

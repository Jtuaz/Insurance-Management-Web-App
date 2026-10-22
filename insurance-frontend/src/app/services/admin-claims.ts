import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

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

export interface UpdateClaimStatusResponse {
  message: string;
  claimId: number;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminClaimsService {
  private readonly apiUrl = 'http://localhost:5042/api/Admin/claims';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');

    return new HttpHeaders({
      Authorization: `Bearer ${token ?? ''}`
    });
  }

  getAllClaims(): Observable<AdminClaim[]> {
    return this.http.get<AdminClaim[]>(this.apiUrl, {
      headers: this.getHeaders()
    });
  }

  updateClaimStatus(
    claimId: number,
    status: 'Approved' | 'Rejected'
  ): Observable<UpdateClaimStatusResponse> {
    return this.http.patch<UpdateClaimStatusResponse>(
      `${this.apiUrl}/${claimId}/status`,
      { status },
      { headers: this.getHeaders() }
    );
  }
}
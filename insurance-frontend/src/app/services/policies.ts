
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Policy {
  policyId: number;
  customerId: number;
  policyType: string;
  premiumAmount: number;
  startDate: string;
  endDate: string;
  status: string;
}

export interface CreatePolicyRequest {
  policyType: string;
  premiumAmount: number;
  startDate: string;
  endDate: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class PoliciesService {
  private readonly apiUrl = 'http://localhost:5042/api/Policies';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');

    return new HttpHeaders({
      Authorization: `Bearer ${token ?? ''}`
    });
  }

  getPolicies(): Observable<Policy[]> {
    return this.http.get<Policy[]>(this.apiUrl, {
      headers: this.getHeaders()
    });
  }

  createPolicy(request: CreatePolicyRequest): Observable<Policy> {
    return this.http.post<Policy>(
      this.apiUrl,
      request,
      { headers: this.getHeaders() }
    );
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CustomerProfile {
  customerId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  createdAt: string | null;
}

export interface UpdateCustomerProfileRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly apiUrl = 'http://localhost:5042/api/Customers/me';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');

    return new HttpHeaders({
      Authorization: `Bearer ${token ?? ''}`
    });
  }

  getMyProfile(): Observable<CustomerProfile> {
    return this.http.get<CustomerProfile>(this.apiUrl, {
      headers: this.getHeaders()
    });
  }

  updateMyProfile(
    request: UpdateCustomerProfileRequest
  ): Observable<CustomerProfile> {
    return this.http.put<CustomerProfile>(
      this.apiUrl,
      request,
      { headers: this.getHeaders() }
    );
  }
}

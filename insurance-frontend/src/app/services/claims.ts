import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  Claim,
  CreateClaimRequest,
  UpdateClaimRequest
} from '../models/claim';

@Injectable({
  providedIn: 'root'
})
export class ClaimsService {
  private readonly apiUrl = 'http://localhost:5042/api/Claims';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');

    return new HttpHeaders({
      Authorization: `Bearer ${token ?? ''}`
    });
  }

  getClaims(): Observable<Claim[]> {
    return this.http.get<Claim[]>(this.apiUrl, {
      headers: this.getHeaders()
    });
  }

  getClaim(id: number): Observable<Claim> {
    return this.http.get<Claim>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  createClaim(request: CreateClaimRequest): Observable<Claim> {
    return this.http.post<Claim>(this.apiUrl, request, {
      headers: this.getHeaders()
    });
  }

  updateClaim(
    id: number,
    request: UpdateClaimRequest
  ): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, request, {
      headers: this.getHeaders()
    });
  }

  deleteClaim(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }
}

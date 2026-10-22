import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginResponse {
  token: string;
  customerId: number;
  email: string;
  firstName: string;
  lastName: string;
}

interface JwtPayload {
  role?: string;
  roles?: string | string[];
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string;
}

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private readonly apiUrl = 'http://localhost:5042/api/Auth';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    const params = new HttpParams()
      .set('email', email)
      .set('password', password);

    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      null,
      { params }
    );
  }

  saveToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getRole(): string | null {
    const token = this.getToken();

    if (!token) {
      return null;
    }

    try {
      const payloadPart = token.split('.')[1];

      if (!payloadPart) {
        return null;
      }

      const base64 = payloadPart
        .replace(/-/g, '+')
        .replace(/_/g, '/');

      const paddedBase64 = base64.padEnd(
        Math.ceil(base64.length / 4) * 4,
        '='
      );

      const payload: JwtPayload = JSON.parse(
        atob(paddedBase64)
      );

      const role =
        payload.role ??
        payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

      if (Array.isArray(payload.roles)) {
        return payload.roles[0] ?? null;
      }

      return role ?? payload.roles ?? null;
    } catch {
      return null;
    }
  }

  isAdmin(): boolean {
    return this.getRole()?.toLowerCase() === 'admin';
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  logout(): void {
    localStorage.removeItem('authToken');
  }
}
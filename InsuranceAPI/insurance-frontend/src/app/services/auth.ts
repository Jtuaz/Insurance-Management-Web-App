
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginResponse {
  token: string;
  customerId: number;
  email: string;
  firstName: string;
  lastName: string;
}

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private apiUrl = 'http://localhost:5042/api/Auth';

  constructor(private http: HttpClient) {}

  login(
    email: string,
    password: string
  ): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
      {}
    );
  }

  register(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    phone: string
  ): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/register` +
      `?firstName=${encodeURIComponent(firstName)}` +
      `&lastName=${encodeURIComponent(lastName)}` +
      `&email=${encodeURIComponent(email)}` +
      `&password=${encodeURIComponent(password)}` +
      `&phone=${encodeURIComponent(phone)}`,
      {}
    );
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  // Reads the role claim from the JWT for UI display purposes.
  getUserRole(): string | null {
    const token = this.getToken();

    if (!token) {
      return null;
    }

    try {
      const parts = token.split('.');

      if (parts.length !== 3) {
        return null;
      }

      // JWT payloads use Base64URL encoding.
      const payload = parts[1]
        .replace(/-/g, '+')
        .replace(/_/g, '/');

      const paddedPayload = payload.padEnd(
        Math.ceil(payload.length / 4) * 4,
        '='
      );

      const claims = JSON.parse(atob(paddedPayload));

      const roleClaim =
        claims['role'] ??
        claims['roles'] ??
        claims[
          'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
        ];

      if (Array.isArray(roleClaim)) {
        const adminRole = roleClaim.find(
          (role: unknown) =>
            typeof role === 'string' &&
            role.toLowerCase() === 'admin'
        );

        return adminRole ?? roleClaim[0] ?? null;
      }

      return typeof roleClaim === 'string'
        ? roleClaim
        : null;
    } catch (error) {
      console.error('Unable to read JWT role:', error);
      return null;
    }
  }

  // Used to decide whether to display administrator navigation.
  isAdmin(): boolean {
    return this.getUserRole()?.toLowerCase() === 'admin';
  }
}

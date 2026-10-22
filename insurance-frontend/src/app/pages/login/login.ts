
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private auth: Auth,
    private router: Router
  ) {}

  login(): void {
    this.errorMessage = '';

    if (!this.email.trim() || !this.password) {
      this.errorMessage = 'Please enter your email and password.';
      return;
    }

    this.isLoading = true;

    this.auth.login(this.email.trim(), this.password).subscribe({
      
    next: (response) => {
      this.auth.saveToken(response.token);

      localStorage.setItem('customerFirstName', response.firstName);
      localStorage.setItem('customerId', response.customerId.toString());
      localStorage.setItem('customerEmail', response.email);

      this.isLoading = false;

      if (this.auth.isAdmin()) {
        this.router.navigate(['/admin/claims']);
      } else {
        this.router.navigate(['/dashboard']);
      }
      },

      error: (error) => {
        this.isLoading = false;

        if (error.status === 401) {
          this.errorMessage = 'Invalid email or password.';
        } else if (error.status === 0) {
          this.errorMessage = 'Unable to connect to the server. Make sure the API is running.';
        } else {
          this.errorMessage = 'Login failed. Please try again.';
        }

        console.error('Login error:', error);
      }
    });
  }
}

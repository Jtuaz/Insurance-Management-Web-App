import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
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
  ) {
  }

  login(): void {

    this.errorMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter your email and password.';
      return;
    }

    this.isLoading = true;

    this.auth.login(
      this.email,
      this.password
    ).subscribe({
      next: (response) => {

        this.auth.saveToken(response.token);

        this.isLoading = false;

        this.router.navigate(['/dashboard']);
      },

      error: (error) => {

        this.isLoading = false;

        if (error.status === 401) {
          this.errorMessage = 'Invalid email or password.';
        }
        else {
          this.errorMessage = 'Unable to connect to the server.';
        }

        console.error('Login error:', error);
      }
    });
  }
}
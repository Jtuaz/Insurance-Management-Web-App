
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { Auth } from '../../services/auth';
import {
  ProfileService,
  CustomerProfile,
  UpdateCustomerProfileRequest
} from '../../services/profile';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  profile: CustomerProfile | null = null;

  isLoading = true;
  isEditing = false;
  isSaving = false;

  errorMessage = '';
  successMessage = '';

  firstName = '';
  lastName = '';
  email = '';
  phone = '';

  private originalProfile: CustomerProfile | null = null;

  constructor(
    private profileService: ProfileService,
    private auth: Auth,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.profileService.getMyProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.originalProfile = { ...profile };
        this.copyProfileToForm(profile);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.isLoading = false;

        if (error.status === 401 || error.status === 403) {
          this.errorMessage =
            'Your session may have expired. Please log in again.';
        } else {
          this.errorMessage =
            'Unable to load your profile. Please try again.';
        }

        console.error('Profile request failed:', error);
        this.cdr.detectChanges();
      }
    });
  }

  private copyProfileToForm(profile: CustomerProfile): void {
    this.firstName = profile.firstName;
    this.lastName = profile.lastName;
    this.email = profile.email;
    this.phone = profile.phone ?? '';
  }

  startEditing(): void {
    if (!this.profile) {
      return;
    }

    this.originalProfile = { ...this.profile };
    this.copyProfileToForm(this.profile);
    this.errorMessage = '';
    this.successMessage = '';
    this.isEditing = true;
  }

  cancelEditing(): void {
    if (this.originalProfile) {
      this.copyProfileToForm(this.originalProfile);
    }

    this.errorMessage = '';
    this.isEditing = false;
  }

  saveProfile(): void {
    this.errorMessage = '';
    this.successMessage = '';

    const request: UpdateCustomerProfileRequest = {
      firstName: this.firstName.trim(),
      lastName: this.lastName.trim(),
      email: this.email.trim(),
      phone: this.phone.trim() || null
    };

    if (!request.firstName || !request.lastName || !request.email) {
      this.errorMessage =
        'First name, last name, and email are required.';
      return;
    }

    this.isSaving = true;

    this.profileService.updateMyProfile(request).subscribe({
      next: (updatedProfile) => {
        this.profile = updatedProfile;
        this.originalProfile = { ...updatedProfile };
        this.copyProfileToForm(updatedProfile);
        this.isEditing = false;
        this.isSaving = false;
        this.successMessage = 'Your profile was updated successfully.';

        // Keep the existing login session data consistent.
        localStorage.setItem('customerFirstName', updatedProfile.firstName);
        localStorage.setItem('customerEmail', updatedProfile.email);

        this.cdr.detectChanges();
      },
      error: (error) => {
        this.isSaving = false;

        if (error.status === 409) {
          this.errorMessage =
            'That email address is already in use.';
        } else if (error.status === 400) {
          this.errorMessage =
            'Please check your information and try again.';
        } else if (error.status === 401 || error.status === 403) {
          this.errorMessage =
            'Your session may have expired. Please log in again.';
        } else {
          this.errorMessage =
            'Unable to save your profile. Please try again.';
        }

        console.error('Profile update failed:', error);
        this.cdr.detectChanges();
      }
    });
  }

  logout(): void {
    this.auth.logout();
    localStorage.removeItem('customerFirstName');
    localStorage.removeItem('customerId');
    localStorage.removeItem('customerEmail');
    this.router.navigate(['/login']);
  }
}

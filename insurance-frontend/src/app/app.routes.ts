
import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { Policies } from './pages/policies/policies';
import { Claims } from './pages/claims/claims';
import { Profile } from './pages/profile/profile';
import { AdminClaims } from './pages/admin-claims/admin-claims';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard },
  { path: 'policies', component: Policies },
  { path: 'claims', component: Claims },
  { path: 'profile', component: Profile },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'admin/claims',
    component: AdminClaims,
    canActivate: [adminGuard]
  },
  { path: '**', redirectTo: 'login' }
];

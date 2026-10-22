import { Routes } from '@angular/router';

import { Login } from './pages/login/login';
import { AdminClaims } from './pages/admin-claims/admin-claims';
import { Dashboard } from './pages/dashboard/dashboard';
import { Policies } from './pages/policies/policies';
import { Claims } from './pages/claims/claims';
import { Payments } from './pages/payments/payments';
import { Profile } from './pages/profile/profile';

export const routes: Routes = [
    {
        path: 'login',
        component: Login
    },
    {
        path: 'dashboard',
        component: Dashboard
    },
    {
        path: 'policies',
        component: Policies
    },
    {
        path: 'claims',
        component: Claims
    },
    {
        path: 'payments',
        component: Payments
    },
    {
        path: 'profile',
        component: Profile
    },
    {
        path: 'admin/claims',
        component: AdminClaims
    },
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    }
];
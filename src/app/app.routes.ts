import { Routes } from '@angular/router';
import { LoginComponent } from './feature/auth/login/login.component';
import { DashboardComponent } from './feature/dashboard/dashboard/dashboard.component';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { SignupComponent } from './feature/auth/signup/signup/signup.component';
import { AppLayoutComponent } from './feature/layout/app-layout/app-layout.component';
import { AuthLayoutComponent } from './feature/layout/auth-layout/auth-layout.component';

export const routes: Routes = [
    {path: "", component: AppLayoutComponent, canActivate:[authGuard], children: [
        {path: "", component: DashboardComponent}
    ]},
    {path: "", component: AuthLayoutComponent, canActivate:[guestGuard], children: [
       {path: "login", component: LoginComponent},
       {path: "register", component: SignupComponent}
    ]},
    {path: '**', redirectTo: ''}
];

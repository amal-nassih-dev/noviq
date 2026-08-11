import { Routes } from '@angular/router';
import { LoginComponent } from './feature/auth/login/login.component';
import { DashboardComponent } from './feature/dashboard/dashboard/dashboard.component';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { SignupComponent } from './feature/auth/signup/signup/signup.component';
import { AppLayoutComponent } from './feature/layout/app-layout/app-layout.component';
import { AuthLayoutComponent } from './feature/layout/auth-layout/auth-layout.component';
import { OrganizationComponent } from './feature/organization/organization.component';
import { ProjectComponent } from './feature/project/project.component';
import { ProjectBoardComponent } from './feature/project-board/project-board.component';
import { OrgMembersComponent } from './feature/org-members/org-members.component';

export const routes: Routes = [
        {
        path: '',
        component: AppLayoutComponent,
        canActivate: [authGuard],
        children: [
        { path: '', component: DashboardComponent },
        { path: 'organizations', component: OrganizationComponent },
        { path: 'organizations/:orgId/projects', component: ProjectComponent },
        { path: 'organizations/:orgId/projects/:projectId', component: ProjectBoardComponent },
        { path: 'organizations/:orgId/members', component: OrgMembersComponent },
        ]
    },
    {path: "", component: AuthLayoutComponent, canActivate:[guestGuard], children: [
       {path: "login", component: LoginComponent},
       {path: "register", component: SignupComponent}
    ]},
    {path: '**', redirectTo: ''}
];

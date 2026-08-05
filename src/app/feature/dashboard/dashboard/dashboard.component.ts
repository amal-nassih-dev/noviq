import { Component, inject } from '@angular/core';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  protected authenticationService = inject(AuthenticationService);
   private readonly router = inject(Router);

  logout(): void{
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

}

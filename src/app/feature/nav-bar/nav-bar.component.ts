import { Component, inject} from '@angular/core';
import { AuthenticationService } from '../../core/services/authentication.service';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { AuthStateService } from '../../core/services/auth-state.service';

@Component({
  selector: 'app-nav-bar',
  imports: [
    RouterLink,
    MatMenuModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
   protected readonly authenticationService = inject(AuthenticationService);
   protected readonly router = inject(Router);
   protected readonly authStateService = inject(AuthStateService);

   logout(){
     this.authenticationService.logout();
     this.router.navigate(['/login']);
   }

}

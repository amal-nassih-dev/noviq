import {
  Component,
  EventEmitter,
  Output,
  inject
} from '@angular/core';

import { Router } from '@angular/router';

import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

import { AuthenticationService } from '../../core/services/authentication.service';
import { AuthStateService } from '../../core/services/auth-state.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    MatMenuModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {

  protected readonly authenticationService =
    inject(AuthenticationService);

  protected readonly router =
    inject(Router);

  protected readonly authStateService =
    inject(AuthStateService);

  @Output()
  menuToggle = new EventEmitter<void>();

  logout(): void {

    this.authenticationService.logout();

    this.router.navigate(['/login']);
  }
}
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
import { ThemeService } from '../../core/services/theme.service';
import { ThemeName } from '../../core/models/theme/theme';

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

  protected readonly themeService =
    inject(ThemeService);

  protected readonly themes: { name: ThemeName; label: string; icon: string }[] = [
    { name: 'slate', label: 'Slate', icon: 'palette' },
    { name: 'ocean', label: 'Ocean', icon: 'water' },
    { name: 'forest', label: 'Forest', icon: 'forest' },
    { name: 'violet', label: 'Violet', icon: 'auto_awesome' },
    { name: 'midnight', label: 'Midnight', icon: 'dark_mode' }
  ];

  setTheme(theme: ThemeName): void {
    this.themeService.setTheme(theme);
  }

  @Output()
  menuToggle = new EventEmitter<void>();

  logout(): void {

    this.authenticationService.logout();

    this.router.navigate(['/login']);
  }
}
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthStateService } from '../services/auth-state.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authStateService = inject(AuthStateService);

  if (authStateService.isLoggedIn()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};

import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthStateService } from '../services/auth-state.service';

// we dont want authenticated users to be seeing the login page again after being loggedIn
export const guestGuard: CanActivateFn = (route, state) => {
  const authStateService = inject(AuthStateService);
  const router = inject(Router);

  if(authStateService.isLoggedIn())
  {
     return router.createUrlTree(['/']);
  }
  return true;
};

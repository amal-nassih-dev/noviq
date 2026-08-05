import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStateService } from '../services/auth-state.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authStateService = inject(AuthStateService);
  const token = authStateService.getToken();
  if (req.url.includes('/auth')) { // because those are public 
    return next(req);
}

  if(!token) {
    return next(req);
  }

  const authenticationRequest = req.clone({ // HttpRequest objects are immutable so if we set the headers directly on req it will not work
    setHeaders : {
      Authorization : `Bearer ${token}`
    }
  })

  return next(authenticationRequest);
};

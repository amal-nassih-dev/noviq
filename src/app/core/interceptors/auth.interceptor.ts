import {
  HttpInterceptorFn,
  HttpErrorResponse
} from '@angular/common/http';

import { inject } from '@angular/core';

import { Router } from '@angular/router';

import {
  catchError,
  throwError
} from 'rxjs';

import { AuthenticationService }
  from '../services/authentication.service';


export const authInterceptor: HttpInterceptorFn =
  (req, next) => {

    const authenticationService =
      inject(AuthenticationService);

    const router =
      inject(Router);


    const token =
      authenticationService.getToken();


    /*
     * Authentication endpoints should never receive
     * the existing JWT.
     */
    const isAuthRequest =
      req.url.includes('/api/auth/');


    let request = req;


    /*
     * Attach JWT only to protected requests.
     */
    if (token && !isAuthRequest) {

      request = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }


    return next(request).pipe(

      catchError(
        (error: HttpErrorResponse) => {

          /*
           * A 401 on a request where we actually sent
           * a JWT means that the JWT is no longer valid.
           *
           * Examples:
           * - expired token
           * - malformed token
           * - invalid signature
           */
          if (
            error.status === 401 &&
            token &&
            !isAuthRequest
          ) {

            authenticationService.logout();

            router.navigate(['/login']);
          }


          return throwError(
            () => error
          );
        }
      )
    );
  };
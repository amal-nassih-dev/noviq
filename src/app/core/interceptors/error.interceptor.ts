import {
  HttpErrorResponse,
  HttpInterceptorFn
} from '@angular/common/http';

import { inject } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';

import {
  catchError,
  throwError
} from 'rxjs';


export const errorInterceptor: HttpInterceptorFn = (
  req,
  next
) => {

  const snackBar =
    inject(MatSnackBar);


  return next(req).pipe(

    catchError(
      (error: HttpErrorResponse) => {

        /*
         * Do NOT handle 401 here.
         *
         * 401 is handled by authInterceptor.
         */
        if (error.status === 401) {

          return throwError(
            () => error
          );
        }


        let message =
          'Something went wrong. Please try again.';


        /*
         * Backend ErrorResponse:
         *
         * {
         *   status: 403,
         *   message: "You do not have permission..."
         * }
         */
        if (
          error.error &&
          typeof error.error === 'object' &&
          error.error.message
        ) {

          message =
            error.error.message;
        }


        /*
         * Sometimes the backend may return
         * a plain string.
         */
        else if (
          typeof error.error === 'string'
        ) {

          message =
            error.error;
        }


        switch (error.status) {

          case 403:

            message =
              error.error?.message ??
              'You do not have permission to perform this action.';

            break;


          case 404:

            message =
              error.error?.message ??
              'The requested resource was not found.';

            break;


          case 409:

            message =
              error.error?.message ??
              'This operation conflicts with existing data.';

            break;


          case 422:

            message =
              error.error?.message ??
              'Please check the submitted data.';

            break;


          case 500:

            message =
              'Something went wrong on the server.';

            break;
        }


        snackBar.open(
          message,
          'Close',
          {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'top'
          }
        );


        return throwError(
          () => error
        );
      }
    )
  );
};
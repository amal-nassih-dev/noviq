import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiError } from '../models/auth/api-error';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  handle(
    error: unknown,
    fallbackMessage = 'Something went wrong. Please try again.'
  ): string {

    if (error instanceof HttpErrorResponse) {
      return this.getHttpErrorMessage(
        error,
        fallbackMessage
      );
    }

    if (error instanceof Error) {
      return error.message || fallbackMessage;
    }

    return fallbackMessage;
  }


  /**
   * Extract the message returned by the backend.
   */
  getMessage(
    error: unknown,
    fallbackMessage = 'Something went wrong. Please try again.'
  ): string {

    if (error instanceof HttpErrorResponse) {
      return this.getHttpErrorMessage(
        error,
        fallbackMessage
      );
    }

    if (this.isApiError(error)) {
      return error.message || fallbackMessage;
    }

    if (error instanceof Error) {
      return error.message || fallbackMessage;
    }

    return fallbackMessage;
  }


  /**
   * Get field validation errors from the backend.
   */
  getFieldErrors(
    error: unknown
  ) {
    if (!(error instanceof HttpErrorResponse)) {
      return [];
    }

    const apiError = error.error as ApiError | null;

    if (!apiError?.fieldErrors) {
      return [];
    }

    return apiError.fieldErrors;
  }


  private getHttpErrorMessage(
    error: HttpErrorResponse,
    fallbackMessage: string
  ): string {

    const apiError = error.error as ApiError | null;

    /*
     * Backend returned our standard ErrorResponse.
     *
     * Example:
     *
     * {
     *   "status": 403,
     *   "message": "You are not allowed..."
     * }
     */
    if (
      apiError &&
      typeof apiError === 'object' &&
      typeof apiError.message === 'string' &&
      apiError.message.trim()
    ) {
      return apiError.message;
    }


    switch (error.status) {

      case 400:
        return 'The request is invalid. Please check your information.';

      case 401:
        return 'Your session has expired. Please log in again.';

      case 403:
        return 'You do not have permission to perform this action.';

      case 404:
        return 'The requested resource could not be found.';

      case 409:
        return 'This action conflicts with existing data.';

      case 422:
        return 'Some of the provided information is invalid.';

      case 500:
        return 'Something went wrong on the server. Please try again later.';

      case 502:
      case 503:
      case 504:
        return 'The server is temporarily unavailable. Please try again later.';

      default:
        return fallbackMessage;
    }
  }


  private isApiError(
    error: unknown
  ): error is ApiError {

    return (
      typeof error === 'object' &&
      error !== null &&
      'message' in error
    );
  }
}
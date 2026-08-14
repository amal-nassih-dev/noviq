import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';

import { ErrorHandlerService } from './error-handler.service';

describe('ErrorHandlerService', () => {
  let service: ErrorHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorHandlerService);
  });

  it('returns fallback for unknown errors', () => {
    expect(service.handle('x' as any)).toBe('Something went wrong. Please try again.');
  });

  it('returns message for Error instances', () => {
    const msg = service.handle(new Error('boom'));
    expect(msg).toBe('boom');
  });

  it('getMessage extracts backend api error message', () => {
    const api = { message: 'ApiErr' } as any;
    const httpErr = new HttpErrorResponse({ status: 400, error: api });
    expect(service.getMessage(httpErr)).toBe('ApiErr');
  });

  it('getFieldErrors returns fieldErrors when present', () => {
    const api = { fieldErrors: [{ field: 'a', message: 'm' }] } as any;
    const httpErr = new HttpErrorResponse({ status: 422, error: api });
    expect(service.getFieldErrors(httpErr)).toEqual(api.fieldErrors);
  });

  it('maps status codes to friendly messages', () => {
    const httpErr = new HttpErrorResponse({ status: 401, error: null });
    expect(service.getMessage(httpErr)).toContain('session');
  });
});

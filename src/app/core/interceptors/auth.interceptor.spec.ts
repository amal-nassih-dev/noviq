import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { environment } from '../../../environments/environment';

import { authInterceptor } from './auth.interceptor';
import { AuthenticationService } from '../services/authentication.service';

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let authStub: any;

  beforeEach(() => {
    authStub = {
      getToken: jasmine.createSpy('getToken').and.returnValue(null),
      logout: jasmine.createSpy('logout')
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        { provide: AuthenticationService, useValue: authStub },
        {
          provide: HTTP_INTERCEPTORS,
          useFactory: () => ({
            intercept: (req: any, next: any) => authInterceptor(req, (r: any) => next.handle(r))
          }),
          multi: true
        }
      ]
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('adds Authorization header when token present and not auth request', () => {
    authStub.getToken.and.returnValue('TOKEN');
    http.get(`${environment.apiUrl}/projects`).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/projects`);
    expect(req.request.headers.get('Authorization')).toBe('Bearer TOKEN');
    req.flush({});
  });

  it('does not add Authorization header for auth endpoints', () => {
    authStub.getToken.and.returnValue('TOKEN');
    http.post(`${environment.apiUrl}/auth/login`, { }).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});
  });

  it('logs out and navigates to login on 401 when token was sent', (done) => {
    authStub.getToken.and.returnValue('TOKEN');

    http.get(`${environment.apiUrl}/projects`).subscribe({
      error: () => {
        expect(authStub.logout).toHaveBeenCalled();
        done();
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/projects`);
    req.flush({ message: 'unauthorized' }, { status: 401, statusText: 'Unauthorized' });
  });
});

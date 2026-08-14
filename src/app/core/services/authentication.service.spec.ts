import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AuthenticationService } from './authentication.service';
import { AuthStateService } from './auth-state.service';
import { environment } from '../../../environments/environment';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let httpMock: HttpTestingController;
  let authStateStub: any;

  beforeEach(() => {
    authStateStub = {
      getToken: jasmine.createSpy('getToken').and.returnValue(null),
      logout: jasmine.createSpy('logout')
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: AuthStateService, useValue: authStateStub }]
    });

    service = TestBed.inject(AuthenticationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('posts login and returns AuthenticationResponse', () => {
    const mockResp = { token: 't', user: { id: 1, name: 'Alice' } } as any;

    service.login({ email: 'a', password: 'b' } as any).subscribe(resp => {
      expect(resp).toEqual(mockResp);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResp);
  });

  it('posts signup and returns AuthenticationResponse', () => {
    const mockResp = { token: 't2', user: { id: 2, name: 'Bob' } } as any;

    service.signup({ name: 'Bob' } as any).subscribe(resp => {
      expect(resp).toEqual(mockResp);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/register`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResp);
  });

  it('getToken delegates to AuthStateService', () => {
    authStateStub.getToken.and.returnValue('XYZ');
    expect(service.getToken()).toBe('XYZ');
    expect(authStateStub.getToken).toHaveBeenCalled();
  });

  it('logout delegates to AuthStateService', () => {
    service.logout();
    expect(authStateStub.logout).toHaveBeenCalled();
  });
});


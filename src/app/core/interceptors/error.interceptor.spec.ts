import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

import { errorInterceptor } from './error.interceptor';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('errorInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let snackBarStub: any;

  beforeEach(() => {
    snackBarStub = { open: jasmine.createSpy('open') };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        { provide: MatSnackBar, useValue: snackBarStub },
        {
          provide: HTTP_INTERCEPTORS,
          useFactory: () => ({
            intercept: (req: any, next: any) => errorInterceptor(req, (r: any) => next.handle(r))
          }),
          multi: true
        }
      ]
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('opens snackbar with backend message when error body contains message', (done) => {
    http.get('/api/resource').subscribe({
      error: () => {
        expect(snackBarStub.open).toHaveBeenCalledWith('No perm', 'Close', jasmine.any(Object));
        done();
      }
    });

    const req = httpMock.expectOne('/api/resource');
    req.flush({ message: 'No perm' }, { status: 403, statusText: 'Forbidden' });
  });

  it('does not handle 401 (passes through)', (done) => {
    http.get('/api/secure').subscribe({
      error: () => {
        expect(snackBarStub.open).not.toHaveBeenCalled();
        done();
      }
    });

    const req = httpMock.expectOne('/api/secure');
    req.flush({ message: 'auth' }, { status: 401, statusText: 'Unauthorized' });
  });
});

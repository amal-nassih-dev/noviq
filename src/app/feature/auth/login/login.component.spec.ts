import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { createAuthStub, createAuthStateStub } from '../../../../testing/test-helpers';
import { throwError, of } from 'rxjs';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';

import { LoginComponent } from './login.component';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { AuthStateService } from '../../../core/services/auth-state.service';
import { of } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    const authStub = createAuthStub();
    const authStateStub = createAuthStateStub();
    const errorHandlerStub = {
      getFieldErrors: (err: any) => [],
      getMessage: (err: any, def: string) => def
    } as Partial<ErrorHandlerService>;

    await TestBed.configureTestingModule({
      imports: [LoginComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: AuthenticationService, useValue: authStub },
        { provide: AuthStateService, useValue: authStateStub }
        ,{ provide: ErrorHandlerService, useValue: errorHandlerStub }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set auth state and navigate on successful login', () => {
    const auth = TestBed.inject(AuthenticationService) as any;
    const authState = TestBed.inject(AuthStateService) as any;
    const router = TestBed.inject(Router);

    spyOn(auth, 'login').and.returnValue(of({ token: 't', user: { id: 1 } }));
    spyOn(authState, 'setAuthentication');
    const navSpy = spyOn(router, 'navigate');

    component.loginForm.setValue({ email: 'a@b.com', password: 'password1' });
    component.onSubmit();

    expect(auth.login).toHaveBeenCalled();
    expect(authState.setAuthentication).toHaveBeenCalledWith('t', { id: 1 });
    expect(navSpy).toHaveBeenCalledWith(['/']);
  });

  it('should set form field errors when error handler returns fieldErrors', () => {
    const auth = TestBed.inject(AuthenticationService) as any;
    const errorHandler = TestBed.inject(ErrorHandlerService) as any;

    spyOn(auth, 'login').and.returnValue(throwError(() => new Error('bad')));
    spyOn(errorHandler, 'getFieldErrors').and.returnValue([{ field: 'email', message: 'Invalid' }]);

    component.loginForm.setValue({ email: 'a@b.com', password: 'password1' });
    component.onSubmit();

    expect(component.loginForm.get('email')?.errors).toEqual({ server: 'Invalid' });
    expect(component.errorMessage()).toBe('');
  });

  it('should set generic error message when no field errors', () => {
    const auth = TestBed.inject(AuthenticationService) as any;
    const errorHandler = TestBed.inject(ErrorHandlerService) as any;

    spyOn(auth, 'login').and.returnValue(throwError(() => new Error('bad')));
    spyOn(errorHandler, 'getFieldErrors').and.returnValue([]);
    spyOn(errorHandler, 'getMessage').and.returnValue('generic error');

    component.loginForm.setValue({ email: 'a@b.com', password: 'password1' });
    component.onSubmit();

    expect(component.errorMessage()).toBe('generic error');
  });
});

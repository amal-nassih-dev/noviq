import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { createAuthStub, createAuthStateStub } from '../../../../../testing/test-helpers';
import { throwError, of } from 'rxjs';
import { ErrorHandlerService } from '../../../../core/services/error-handler.service';
import { Router } from '@angular/router';

import { SignupComponent } from './signup.component';
import { AuthenticationService } from '../../../../core/services/authentication.service';
import { AuthStateService } from '../../../../core/services/auth-state.service';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;

  beforeEach(async () => {
    const authStub = createAuthStub();
    const authStateStub = createAuthStateStub();
    const errorHandlerStub = {
      getFieldErrors: (err: any) => [],
      getMessage: (err: any, def: string) => def
    } as Partial<ErrorHandlerService>;

    await TestBed.configureTestingModule({
      imports: [SignupComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: AuthenticationService, useValue: authStub },
        { provide: AuthStateService, useValue: authStateStub }
        ,{ provide: ErrorHandlerService, useValue: errorHandlerStub }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set auth state and navigate on successful signup', () => {
    const auth = TestBed.inject(AuthenticationService) as any;
    const authState = TestBed.inject(AuthStateService) as any;
    const router = TestBed.inject(Router) as any;

    spyOn(auth, 'signup').and.returnValue(of({ token: 't', user: { id: 2 } }));
    spyOn(authState, 'setAuthentication');
    const navSpy = spyOn(router, 'navigate' as any);

    (component as any).signupForm.setValue({ email: 'a@b.com', fullName: 'Name', password: 'password1', confirmPassword: 'password1' });
    component.onSubmit();

    expect(auth.signup).toHaveBeenCalled();
    expect(authState.setAuthentication).toHaveBeenCalledWith('t', { id: 2 });
    expect(navSpy).toHaveBeenCalledWith(['/']);
  });

  it('should set form field errors when signup returns field errors', () => {
    const auth = TestBed.inject(AuthenticationService) as any;
    const errorHandler = TestBed.inject(ErrorHandlerService) as any;

    spyOn(auth, 'signup').and.returnValue(throwError(() => new Error('bad')));
    spyOn(errorHandler, 'getFieldErrors').and.returnValue([{ field: 'email', message: 'Invalid' }]);

    (component as any).signupForm.setValue({ email: 'a@b.com', fullName: 'Name', password: 'password1', confirmPassword: 'password1' });
    component.onSubmit();

    expect((component as any).signupForm.get('email')?.errors).toEqual({ server: 'Invalid' });
    expect((component as any).errorMessage()).toBe('');
  });

  it('should set generic error message on signup failure without field errors', () => {
    const auth = TestBed.inject(AuthenticationService) as any;
    const errorHandler = TestBed.inject(ErrorHandlerService) as any;

    spyOn(auth, 'signup').and.returnValue(throwError(() => new Error('bad')));
    spyOn(errorHandler, 'getFieldErrors').and.returnValue([]);
    spyOn(errorHandler, 'getMessage').and.returnValue('generic signup error');

    (component as any).signupForm.setValue({ email: 'a@b.com', fullName: 'Name', password: 'password1', confirmPassword: 'password1' });
    component.onSubmit();

    expect((component as any).errorMessage()).toBe('generic signup error');
  });
});

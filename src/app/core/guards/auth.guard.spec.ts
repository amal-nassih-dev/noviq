import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { authGuard } from './auth.guard';
import { AuthStateService } from '../services/auth-state.service';

describe('authGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  let authStateStub: any;
  let router: Router;

  beforeEach(() => {
    authStateStub = { isLoggedIn: jasmine.createSpy('isLoggedIn').and.returnValue(false) };

    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      providers: [{ provide: AuthStateService, useValue: authStateStub }]
    });

    router = TestBed.inject(Router);
  });

  it('redirects to /login when not logged in', () => {
    const route = {} as any;
    const state = { url: '/login' } as any;
    const result = executeGuard(route, state);
    expect(result).toEqual(router.createUrlTree(['/login']));
  });

  it('allows activation when logged in', () => {
    authStateStub.isLoggedIn.and.returnValue(true);
    const route = {} as any;
    const state = { url: '/' } as any;
    const result = executeGuard(route, state);
    expect(result).toBeTrue();
  });
});

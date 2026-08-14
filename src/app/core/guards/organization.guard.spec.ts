import { TestBed } from '@angular/core/testing';
import { Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { organizationGuard } from './organization.guard';
import { OrganizationService } from '../services/organization.service';
import { OrganizationalContextService } from '../services/organizational-context.service';
import { AuthStateService } from '../services/auth-state.service';

describe('organizationGuard', () => {
  const executeGuard = (route: any, state?: any) =>
    TestBed.runInInjectionContext(() => organizationGuard(route, state));

  let router: Router;
  let orgServiceStub: any;
  let orgContextStub: any;
  let authStateStub: any;

  beforeEach(() => {
    orgServiceStub = {
      getAll: jasmine.createSpy('getAll').and.returnValue(of([]))
    };

    orgContextStub = {
      initializeContext: jasmine.createSpy('initializeContext').and.returnValue(of(void 0)),
      organizations: jasmine.createSpy('organizations').and.returnValue([])
    };

    authStateStub = {
      isLoggedIn: jasmine.createSpy('isLoggedIn').and.returnValue(false)
    };

    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      providers: [
        { provide: OrganizationService, useValue: orgServiceStub },
        { provide: OrganizationalContextService, useValue: orgContextStub },
        { provide: AuthStateService, useValue: authStateStub }
      ]
    });

    router = TestBed.inject(Router);
  });

  it('redirects to /login when not authenticated', () => {
    authStateStub.isLoggedIn.and.returnValue(false);

    const snapshot = { paramMap: convertToParamMap({}) } as any;

    const result = executeGuard(snapshot);

    expect(result).toEqual(router.parseUrl('/login'));
  });

  it('allows activation when organization exists', (done) => {
    authStateStub.isLoggedIn.and.returnValue(true);

    orgContextStub.organizations.and.returnValue([{ id: 1 }]);
    orgServiceStub.getAll.and.returnValue(of([]));

    const snapshot = { paramMap: convertToParamMap({ orgId: '1' }) } as any;

    const result$ = executeGuard(snapshot) as any;

    result$.subscribe((res: any) => {
      expect(res).toBeTrue();
      done();
    });
  });

  it('redirects to / when requested org is missing', (done) => {
    authStateStub.isLoggedIn.and.returnValue(true);

    orgContextStub.organizations.and.returnValue([{ id: 2 }]);
    orgServiceStub.getAll.and.returnValue(of([]));

    const snapshot = { paramMap: convertToParamMap({ orgId: '1' }) } as any;

    const result$ = executeGuard(snapshot) as any;

    result$.subscribe((res: any) => {
      expect(res).toEqual(router.parseUrl('/'));
      done();
    });
  });
});

import { TestBed } from '@angular/core/testing';

import { AuthStateService } from './auth-state.service';

describe('AuthStateService', () => {
  let service: AuthStateService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthStateService);
  });

  afterEach(() => localStorage.clear());

  it('initially has no token and user', () => {
    expect(service.getToken()).toBeNull();
    expect(service.user()).toBeNull();
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('setAuthentication stores token and user and updates signal', () => {
    const user = { id: 1, name: 'A' } as any;
    service.setAuthentication('TOK', user);

    expect(localStorage.getItem('token')).toBe('TOK');
    expect(JSON.parse(localStorage.getItem('user') || '')).toEqual(user);
    expect(service.user()).toEqual(user);
    expect(service.isLoggedIn()).toBeTrue();
  });

  it('logout clears token and user', () => {
    service.setAuthentication('TOK', { id: 2 } as any);
    service.logout();

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
    expect(service.user()).toBeNull();
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('loadUser returns null for invalid JSON', () => {
    localStorage.setItem('user', 'not-json');
    const s = TestBed.inject(AuthStateService);
    expect(s.user()).toBeNull();
  });
});

import { of } from 'rxjs';
import { signal } from '@angular/core';

export function createAuthStub() {
  return {
    login: () => of({ token: '', user: {} }),
    signup: () => of({ token: '', user: {} }),
    getToken: () => null,
    logout: () => {}
  } as any;
}

export function createAuthStateStub() {
  return {
    login: () => {},
    getToken: () => null,
    user: () => ({ fullName: 'Test User', email: 'test@example.com' })
  } as any;
}

export function createOrgContextStub() {
  return {
    members: signal([] as any[]),
    currentOrganization: signal(null as any),
    projects: signal([] as any[])
  } as any;
}

export function createActivatedRouteStub(params: Record<string, any> = {}) {
  return {
    snapshot: { paramMap: { get: (key: string) => params[key] ?? null } },
    params: of(params),
    paramMap: of({ get: (key: string) => params[key] ?? null })
  } as any;
}

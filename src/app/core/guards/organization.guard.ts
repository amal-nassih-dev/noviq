import { inject } from '@angular/core';

import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router
} from '@angular/router';

import {
  map,
  switchMap
} from 'rxjs';

import { OrganizationService }
  from '../services/organization.service';

import { OrganizationalContextService }
  from '../services/organizational-context.service';

import { AuthStateService }
  from '../services/auth-state.service';

export const organizationGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot
) => {

  const organizationService =
    inject(OrganizationService);

  const authStateService =
    inject(AuthStateService);

  const organizationContext =
    inject(OrganizationalContextService);

  const router =
    inject(Router);


  /*
   * User is not authenticated.
   *
   * Do NOT call the backend.
   */
  if (!authStateService.isLoggedIn()) {

    return router.parseUrl('/login');
  }


  const orgIdParam =
    route.paramMap.get('orgId');

  const orgId =
    orgIdParam !== null
      ? Number(orgIdParam)
      : undefined;


  /*
   * Load organizations first.
   */
  return organizationService
    .getAll()
    .pipe(

      /*
       * Initialize the organization context
       * after organizations have been loaded.
       */
      switchMap(() =>
        organizationContext.initializeContext(orgId)
      ),

      map(() => {

        /*
         * If an organization ID was supplied
         * but doesn't exist, redirect.
         */
        if (
          orgId !== undefined &&
          !organizationContext
            .organizations()
            .some(org => org.id === orgId)
        ) {

          return router.parseUrl('/');
        }

        return true;
      })
    );
};
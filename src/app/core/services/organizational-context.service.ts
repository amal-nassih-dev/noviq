import { Injectable, inject, signal } from '@angular/core';

import { OrganizationService } from './organization.service';
import { ProjectService } from './project.service';
import { OrganizationMemberService } from './organization-member.service';

import { OrganizationResponse } from '../models/organization/organization-response';
import { ProjectRequest } from '../models/project/project-request';
import { ProjectResponse } from '../models/project/project-response';
import { OrgMemberResponse } from '../models/organization-member/organization-member-response';

import {
  forkJoin,
  Observable,
  of,
  switchMap,
  tap
} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrganizationalContextService {

  private readonly organizationService =
    inject(OrganizationService);

  private readonly projectService =
    inject(ProjectService);

  private readonly organizationMemberService =
    inject(OrganizationMemberService);

  private readonly STORAGE_KEY =
    'noviq.currentOrganizationId';

  readonly currentOrganization =
    signal<OrganizationResponse | null>(null);

  readonly organizations =
    this.organizationService.organizations;

  readonly projects =
    this.projectService.projects;

  readonly members =
    this.organizationMemberService.members;

  private readonly _contextLoaded = signal(false);

  readonly contextLoaded = this._contextLoaded.asReadonly();


  /**
   * Initialize the organizational context.
   *
   * Priority:
   * 1. URL organization has highest priority
   * 2. Previously selected organization
   * 3. First available organization
   */
  initializeContext(
    orgId?: number
  ): Observable<{
    projects: ProjectResponse[];
    members: OrgMemberResponse[];
  }> {

    const organizations = this.organizations();

    const emptyResult = {
      projects: [],
      members: []
    };

    if (organizations.length === 0) {
      this.currentOrganization.set(null);

      return of(emptyResult);
    }

    // URL organization has priority.
    if (orgId !== undefined) {

      const organization = organizations.find(
        org => org.id === orgId
      );

      if (!organization) {
        return of(emptyResult);
      }

      const current = this.currentOrganization();

      if (current?.id === organization.id && this.contextLoaded()) {
        return of({
          projects: this.projects(),
          members: this.members()
        });
      }

      return this.selectOrganization(organization);
    }

    // No organization in URL.
    // Use the previously selected organization.
    const storedOrganizationId =
      this.getStoredOrganizationId();

    if (storedOrganizationId !== null) {

      const organization = organizations.find(
        org => org.id === storedOrganizationId
      );

      if (organization) {

        const current =
          this.currentOrganization();

        if (current?.id === organization.id && this.contextLoaded()) {
          return of({
            projects: this.projects(),
            members: this.members()
          });
        }

        return this.selectOrganization(organization);
      }
    }
        // Nothing stored → first organization.
    return this.selectOrganization(organizations[0]);
  }

  /**
   * Select an organization and load its data.
   */
  selectOrganization(
    organization: OrganizationResponse
  ): Observable<{
    projects: ProjectResponse[];
    members: OrgMemberResponse[];
  }> {
    this._contextLoaded.set(false);
    this.currentOrganization.set(organization);

    this.storeOrganizationId(organization.id);

    this.projectService.clear();
    this.organizationMemberService.clear();

    return this.loadOrganizationData(organization.id);
  }

  /**
   * Load all data belonging to the current organization.
   */
  private loadOrganizationData(
    organizationId: number
  ): Observable<{
    projects: ProjectResponse[];
    members: OrgMemberResponse[];
  }> {

    return forkJoin({
      projects: this.projectService.findAll(organizationId),
      members: this.organizationMemberService.findAll(organizationId)
    }).pipe(
    tap(() => {
      this._contextLoaded.set(true);
    })
  );;
  }

  /**
   * Get the last selected organization ID.
   */
  private getStoredOrganizationId(): number | null {

    const value =
      localStorage.getItem(this.STORAGE_KEY);

    if (!value) {
      return null;
    }

    const id = Number(value);

    return Number.isNaN(id)
      ? null
      : id;
  }

  /**
   * Remember the selected organization.
   */
  private storeOrganizationId(
    organizationId: number
  ): void {

    localStorage.setItem(
      this.STORAGE_KEY,
      String(organizationId)
    );
  }

}
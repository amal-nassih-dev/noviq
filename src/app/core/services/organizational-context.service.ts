import { Injectable, inject, signal } from '@angular/core';

import { OrganizationService } from './organization.service';
import { ProjectService } from './project.service';
import { OrganizationMemberService } from './organization-member.service';

import { OrganizationResponse } from '../models/organization/organization-response';
import { ProjectRequest } from '../models/project/project-request';

import { switchMap } from 'rxjs';

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


  /**
   * Initialize the organizational context.
   *
   * Priority:
   *
   * 1. Previously selected organization
   * 2. First available organization
   */
  initialize(): void {

    const organizations =
      this.organizations();

    if (organizations.length === 0) {
      this.currentOrganization.set(null);
      return;
    }

    const storedOrganizationId =
      this.getStoredOrganizationId();

    if (storedOrganizationId !== null) {

      const storedOrganization =
        organizations.find(
          organization =>
            organization.id === storedOrganizationId
        );

      if (storedOrganization) {
        this.selectOrganization(storedOrganization);
        return;
      }
    }

    // Nothing stored or stored organization no longer exists.
    this.selectOrganization(organizations[0]);
  }


  /**
   * Select an organization and load its data.
   */
  selectOrganization(
    organization: OrganizationResponse
  ): void {

    this.currentOrganization.set(organization);

    this.storeOrganizationId(organization.id);

    this.loadOrganizationData(organization.id);
  }


  /**
   * Load all data belonging to the current organization.
   */
  private loadOrganizationData(
    organizationId: number
  ): void {

    this.projectService
      .findAll(organizationId)
      .subscribe();

    this.organizationMemberService
      .findAll(organizationId)
      .subscribe();
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


  /**
   * Create a project and refresh the
   * projects belonging to the organization.
   */
  createProject(
    organizationId: number,
    request: ProjectRequest
  ) {

    return this.projectService
      .addProject(
        organizationId,
        request
      )
      .pipe(
        switchMap(() =>
          this.projectService.findAll(organizationId)
        )
      );
  }
}
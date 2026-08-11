import {
  Component,
  signal,
  inject,
  OnInit,
  DestroyRef,
  computed
} from '@angular/core';

import {
  Router,
  RouterLink,
  RouterLinkActive,
  NavigationEnd
} from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';

import { filter, switchMap, of } from 'rxjs';

import { ProjectService } from '../../core/services/project.service';
import { OrganizationService } from '../../core/services/organization.service';
import { OrganizationMemberService } from '../../core/services/organization-member.service';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { OrganizationResponse } from '../../core/models/organization/organization-response';

import { ProjectDialogComponent } from '../project/project-dialog/project-dialog.component';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent implements OnInit {

  readonly isCollapsed = signal(false);
  readonly isOrganizationMenuOpen = signal(false);

  private readonly projectService = inject(ProjectService);
  private readonly organizationService = inject(OrganizationService);
  private readonly organizationMemberService =
    inject(OrganizationMemberService);

  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);

  readonly organizations =
    this.organizationService.organizations;

  readonly projects =
    this.projectService.projects;

  readonly members =
    this.organizationMemberService.members;


  readonly currentOrganization = this.organizationService.currentOrganization;

  /**
   * Only display the first 5 projects in the sidebar.
   */
  readonly sidebarProjects = computed(() =>
    this.projects().slice(0, 5)
  );

  /**
   * Whether there are more than 5 projects.
   */
  readonly hasMoreProjects = computed(() =>
    this.projects().length > 5
  );

  ngOnInit(): void {

    /*
     * Load organizations.
     */
    this.organizationService
        .getAll()
        .pipe(
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe(organizations => {

          if (organizations.length === 0) {
            this.organizationService
              .setCurrentOrganization(null);

            return;
          }

          this.initializeCurrentOrganization(
            this.router.url,
            organizations
          );
      });

      


    /*
     * React to route changes.
     */
    this.router.events
      .pipe(
        filter(
          event => event instanceof NavigationEnd
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(event => {

        const navigation =
          event as NavigationEnd;

        this.updateCurrentOrganization(
          navigation.urlAfterRedirects,
          this.organizations()
        );
      });
  }

  private initializeCurrentOrganization(
    url: string,
    organizations: OrganizationResponse[]
  ): void {

    // 1. First try to get organization from URL
    const organizationId =
      this.extractOrganizationId(url);

    if (organizationId) {

      const organization =
        organizations.find(
          org => org.id === organizationId
        );

      if (organization) {

        this.organizationService
          .setCurrentOrganization(organization);

        this.loadOrganizationData(
          organization.id
        );

        return;
      }
    }


    // 2. No organization in URL.
    // Try the previously selected organization.
    const storedId =
      this.organizationService
        .getCurrentOrganizationId();

    if (storedId) {

      const organization =
        organizations.find(
          org => org.id === storedId
        );

      if (organization) {

        this.organizationService
          .setCurrentOrganization(organization);

        this.loadOrganizationData(
          organization.id
        );

        return;
      }
    }


    // 3. Nothing selected yet.
    // Use the first organization.
    const organization =
      organizations[0];

    this.organizationService
      .setCurrentOrganization(organization);

    this.loadOrganizationData(
      organization.id
    );
 }

   private loadOrganizationData(
      organizationId: number
    ): void {

      this.loadProjects(organizationId);
      this.loadMembers(organizationId);
    }

   private updateCurrentOrganization(
  url: string,
  organizations: OrganizationResponse[]
): void {

  const organizationId =
    this.extractOrganizationId(url);

  // Dashboard / routes without an organization
  // should keep the currently selected organization.
  if (!organizationId) {
    return;
  }

  const organization =
    organizations.find(
      org => org.id === organizationId
    );

  if (!organization) {
    return;
  }

  const current =
    this.organizationService.currentOrganization();

  if (current?.id === organization.id) {
    return;
  }

  this.organizationService
    .setCurrentOrganization(organization);

  this.loadOrganizationData(
    organization.id
  );
}

  private extractOrganizationId(
    url: string
  ): number | null {

    const match =
      url.match(/\/organizations\/(\d+)/);

    if (!match) {
      return null;
    }

    const id = Number(match[1]);

    return Number.isNaN(id)
      ? null
      : id;
  }


  private loadProjects(
    organizationId: number
  ): void {

    this.projectService
      .findAll(organizationId)
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        error: error => {
          console.error(
            'Failed to load projects',
            error
          );
        }
      });
  }


  private loadMembers(
    organizationId: number
  ): void {

    this.organizationMemberService
      .findAll(organizationId)
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        error: error => {
          console.error(
            'Failed to load members',
            error
          );
        }
      });
  }


  toggle(): void {

    this.isCollapsed.update(
      value => !value
    );
  }


  toggleOrganizationMenu(): void {

    this.isOrganizationMenuOpen.update(
      value => !value
    );
  }


  selectOrganization(
    organization: OrganizationResponse
  ): void {
    this.organizationService
    .setCurrentOrganization(organization);
    this.isOrganizationMenuOpen.set(false);

    /*
     * Clear old organization data.
     */
    this.projectService.clear();
    this.organizationMemberService.clear();

    /*
     * Load new organization data.
     */
    this.loadOrganizationData(
      organization.id
    );

    /*
     * Navigate to the new organization.
     */
    this.router.navigate([
      '/organizations',
      organization.id,
      'projects'
    ]);
  }


  createProject(): void {

    const organization =
      this.currentOrganization();

    if (!organization) {
      return;
    }

    this.dialog
      .open(ProjectDialogComponent, {
        width: '520px',
        maxWidth: '95vw',
        panelClass: 'project-dialog',

        data: {
          project: null,
          organizationId: organization.id
        }
      })
      .afterClosed()
      .pipe(
        filter(result => !!result),
        switchMap(result =>
          this.projectService.addProject(
            organization.id,
            result
          )
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => {

          /*
           * Refresh sidebar projects.
           */
          this.loadProjects(
            organization.id
          );
        },

        error: error => {
          console.error(
            'Failed to create project',
            error
          );
        }
      });
  }


  manageOrganizations(): void {

    this.isOrganizationMenuOpen.set(false);

    this.router.navigate([
      '/organizations'
    ]);
  }
}
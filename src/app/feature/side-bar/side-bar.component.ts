import {
  Component,
  signal,
  inject,
  computed,
  DestroyRef
} from '@angular/core';

import {
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';

import { filter, switchMap } from 'rxjs';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { OrganizationResponse } from '../../core/models/organization/organization-response';

import { ProjectDialogComponent } from '../project/project-dialog/project-dialog.component';
import { OrganizationalContextService } from '../../core/services/organizational-context.service';
import { ProjectService } from '../../core/services/project.service';
import { ProjectResponse } from '../../core/models/project/project-response';
import { NotificationService } from '../../core/services/notification.service';

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
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent{

  readonly isCollapsed = signal(false);
  readonly isMobileOpen = signal(false);
  readonly isOrganizationMenuOpen = signal(false);

  private readonly destroyRef = inject(DestroyRef);

  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly organizationContext =inject(OrganizationalContextService);
  private readonly projectService =inject(ProjectService);

  readonly organizations =
    this.organizationContext.organizations;

  readonly projects =
    this.organizationContext.projects;

  private readonly notification = inject(NotificationService);

  readonly currentOrganization = this.organizationContext.currentOrganization;

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
    this.isOrganizationMenuOpen.set(false);

    this.closeMobile();
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
      .subscribe(
        {
          next: () => {
            this.notification.success(
              'Project created successfully.'
            );
          }
        }
      );
  }


  manageOrganizations(): void {

    this.isOrganizationMenuOpen.set(false);
    this.closeMobile();

    this.router.navigate([
      '/organizations'
    ]);
  }

  toggleMobile(): void {
    this.isMobileOpen.update(open => !open);
  }

  closeMobile(): void {
    this.isMobileOpen.set(false);
  }

  private readonly PROJECT_COLORS = [
    '#6366F1', // Indigo
    '#8B5CF6', // Violet
    '#EC4899', // Pink
    '#EF4444', // Red
    '#F97316', // Orange
    '#F59E0B', // Amber
    '#10B981', // Emerald
    '#14B8A6', // Teal
    '#06B6D4', // Cyan
    '#3B82F6'  // Blue
  ];

  getProjectColor(project: ProjectResponse): string {
    return this.PROJECT_COLORS[
      project.id % this.PROJECT_COLORS.length
    ];
  }

}
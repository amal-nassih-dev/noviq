import {
  Component,
  signal,
  inject,
  computed
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
export class SideBarComponent{

  readonly isCollapsed = signal(false);
  readonly isOrganizationMenuOpen = signal(false);

  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly organizationContext =inject(OrganizationalContextService);

  readonly organizations =
    this.organizationContext.organizations;

  readonly projects =
    this.organizationContext.projects;

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
    this.organizationContext.selectOrganization(organization);
    this.isOrganizationMenuOpen.set(false);

    this.router.navigate([
      '/'
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
          this.organizationContext.createProject(
            organization.id,
            result
          )
        )
      )
      .subscribe({
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
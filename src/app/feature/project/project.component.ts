import {
  Component,
  inject,
  signal
} from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { UiButtonComponent } from '../../shared/component/ui-button/ui-button/ui-button.component';
import { ProjectCardComponent } from './project-card/project-card.component';
import { UiCardComponent } from '../../shared/component/ui-card/ui-card.component';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { filter, switchMap } from 'rxjs';

import { ProjectResponse } from '../../core/models/project/project-response';
import { ProjectDialogComponent } from './project-dialog/project-dialog.component';
import { UiConfirmDialogComponent } from '../../shared/component/ui-confirm-dialog/ui-confirm-dialog.component';

import { OrganizationalContextService } 
  from '../../core/services/organizational-context.service';
import { ProjectService } from '../../core/services/project.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-project',
  imports: [
    MatIconModule,
    UiButtonComponent,
    ProjectCardComponent,
    UiCardComponent,
    RouterLink
  ],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css'
})
export class ProjectComponent {

  private readonly dialog = inject(MatDialog);

  private readonly organizationContext =
    inject(OrganizationalContextService);

  private readonly projectService = inject(ProjectService);

  readonly currentOrganization =
    this.organizationContext.currentOrganization;

  readonly projects =
    this.organizationContext.projects;

  readonly contextLoaded = this.organizationContext.contextLoaded;

  private readonly notification = inject(NotificationService);

  openEditDialog(response: ProjectResponse): void {

    const organization =
      this.currentOrganization();

    if (!organization) {
      return;
    }

    this.dialog
      .open(ProjectDialogComponent, {
        width: '500px',
        maxWidth: 'calc(100vw - 1.5rem)',
        panelClass: 'project-dialog',
        data: response
      })
      .afterClosed()
      .pipe(
        filter(result => !!result),
        switchMap(result =>
          this.projectService
            .updateProject(
              organization.id,
              result,
              response.id
            )
        )
      )
      .subscribe(
        {
          next: () => {
            this.notification.success(
              'Project updated successfully.'
            );
          }
        }
      );
  }

  openDeleteDialog(response: ProjectResponse): void {

    const organization =
      this.currentOrganization();

    if (!organization) {
      return;
    }

    const ref = this.dialog.open(
      UiConfirmDialogComponent,
      {
        width: '400px',
        data: {
          title: 'Delete Project',
          message:
            `This will permanently delete "${response.name}" and all its tasks. This action cannot be undone.`,
          confirmLabel: 'Delete',
          danger: true
        }
      }
    );

    ref.afterClosed()
      .pipe(
        filter(confirmed => confirmed === true),
        switchMap(() =>
          this.projectService.deleteProject(
            organization.id,
            response.id
          )
        )
      )
      .subscribe({
        next: () => {
          this.notification.success(
            'Project deleted successfully.'
          );
        }
      });
  }

  openCreateDialog(): void {

    const organization =
      this.currentOrganization();

    if (!organization) {
      return;
    }

    this.dialog
      .open(ProjectDialogComponent, {
        width: '500px',
        maxWidth: 'calc(100vw - 1.5rem)',
        panelClass: 'project-dialog'
      })
      .afterClosed()
      .pipe(
        filter(result => !!result),
        switchMap(result =>
          this.projectService.addProject(
            organization.id,
            result
          )
        )
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
}
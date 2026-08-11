import { Component, inject, signal, OnInit, DestroyRef} from '@angular/core';
import { ProjectService } from '../../core/services/project.service';
import { MatIconModule } from '@angular/material/icon';
import { UiButtonComponent } from '../../shared/component/ui-button/ui-button/ui-button.component';
import { ActivatedRoute } from '@angular/router';
import { filter, finalize, forkJoin, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProjectCardComponent } from './project-card/project-card.component';
import { UiCardComponent } from '../../shared/component/ui-card/ui-card.component';
import { ProjectResponse } from '../../core/models/project/project-response';
import { RouterLink } from '@angular/router';
import { ProjectDialogComponent } from './project-dialog/project-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { UiConfirmDialogComponent } from '../../shared/component/ui-confirm-dialog/ui-confirm-dialog.component';
import { OrganizationResponse } from '../../core/models/organization/organization-response';
import { OrganizationService } from '../../core/services/organization.service';

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
export class ProjectComponent implements OnInit{
   private readonly projectService = inject(ProjectService);
   private readonly orgService = inject(OrganizationService);
   private readonly activeRoute = inject(ActivatedRoute);
   protected readonly loading = signal(true);
   protected readonly destroyRef = inject(DestroyRef);
   orgId = signal<number>(0);
   projects = this.projectService.projects;
   private readonly dialog = inject(MatDialog);
   protected readonly organization = signal<OrganizationResponse | null>(null);

   ngOnInit(): void {
      const id = Number(this.activeRoute.snapshot.paramMap.get('orgId'));
      this.orgId.set(id);
      this.orgService.getById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(org => this.organization.set(org));

    this.projectService.findAll(id)
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        error: (err) => console.error(err)
      });
   }

   openEditDialog(response: ProjectResponse){
      this.dialog.open(ProjectDialogComponent, {
              width: '500px',
              maxWidth: 'calc(100vw - 1.5rem)',
              panelClass: 'project-dialog',
              data: response
            }).afterClosed().pipe(
              filter(result => !!result),
              switchMap(result => this.projectService.updateProject(this.orgId(),result,response.id))
            ).subscribe();
   }

   openDeleteDialog(response: ProjectResponse){
     const ref = this.dialog.open(UiConfirmDialogComponent, {
           width: '400px',
           data: {
             title: 'Delete Project',
             message: `This will permanently delete "${response.name}" and all its tasks. This action cannot be undone.`,
             confirmLabel: 'Delete',
             danger: true
           }
         });
     
         ref.afterClosed().subscribe(confirmed => {
           if (!confirmed) return;
     
           this.projectService.deleteProject(this.orgId(), response.id).subscribe({
             error: (err) => alert(err?.error?.message || 'Delete failed')
           });
         });
   }

   openCreateDialog(){
      this.dialog.open(ProjectDialogComponent, {
              width: '500px',
              maxWidth: 'calc(100vw - 1.5rem)',
              panelClass: 'project-dialog'
            }).afterClosed().pipe(
              filter(result => !!result),
              switchMap(result => this.projectService.addProject(this.orgId(),result))
            ).subscribe();
   }
}

import { Component, inject, signal, OnInit, DestroyRef } from '@angular/core';
import { OrganizationService } from '../../core/services/organization.service';
import { UiButtonComponent } from '../../shared/component/ui-button/ui-button/ui-button.component';
import { OrganizationCardComponent } from './organization-card/organization-card.component';
import { MatIconModule } from '@angular/material/icon';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize, switchMap } from 'rxjs';
import { UiCardComponent } from '../../shared/component/ui-card/ui-card.component';
import { MatDialog } from '@angular/material/dialog';
import { OrganizationDialogComponent } from './organization-dialog/organization-dialog.component';
import { OrganizationResponse } from '../../core/models/organization/organization-response';
import { filter } from 'rxjs';
import { UiConfirmDialogComponent } from '../../shared/component/ui-confirm-dialog/ui-confirm-dialog.component';
import { OrganizationMemberDialogComponent } from '../organization-member-dialog/organization-member-dialog.component';
import { OrganizationMemberService } from '../../core/services/organization-member.service';

@Component({
  selector: 'app-organization',
  imports: [
    UiButtonComponent,
    OrganizationCardComponent,
    MatIconModule,
    UiCardComponent
    ],
  templateUrl: './organization.component.html',
  styleUrl: './organization.component.css'
})
export class OrganizationComponent implements OnInit{
   
   protected readonly orgService = inject(OrganizationService);
   protected readonly destroyRef = inject(DestroyRef);

   protected readonly organizations = this.orgService.organizations;
   protected readonly loading = signal(true);
   protected readonly error = signal('');
   private readonly dialog = inject(MatDialog);
   private readonly orgMemberService = inject(OrganizationMemberService);
   

   ngOnInit(): void {
      this.orgService
        .getAll()
        .pipe(
          finalize(() => this.loading.set(false)),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe(
          {
            error: () => {
                this.error.set(
                    'Unable to load organizations.'
                );
            }
          }
        );
   }

  openCreateDialog(): void {
      this.dialog.open(OrganizationDialogComponent, {
        width: '500px',
        maxWidth: 'calc(100vw - 1.5rem)',
         //data: organization ?? null, // null = create mode, object = edit mode
         panelClass: 'organization-dialog'
      }).afterClosed().pipe(
        filter(result => !!result),
        switchMap(result => this.orgService.create(result))
      ).subscribe();
    }

  openEditDialog(
      organization: OrganizationResponse
     ){
      const dialogRef = this.dialog.open(
          OrganizationDialogComponent,
          {
              width: '500px',
              maxWidth: 'calc(100vw - 1.5rem)',
              data: organization
          }
      );
      dialogRef.afterClosed().pipe(
        filter(result => !!result),
        switchMap(result => this.orgService.update( organization.id,result))
      ).subscribe();
  }

  openDeleteDialog(org: OrganizationResponse){
    const ref = this.dialog.open(UiConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete organization',
        message: `This will permanently delete "${org.name}" and all its projects and tasks. This action cannot be undone.`,
        confirmLabel: 'Delete',
        danger: true
      }
    });

    ref.afterClosed().subscribe(confirmed => {
      if (!confirmed) return;

      this.orgService.delete(org.id).subscribe({
        error: (err) => alert(err?.error?.message || 'Delete failed')
      });
    });
  }

  openAddMemberDialog(organizationId: number): void {

    const dialogRef = this.dialog.open(
      OrganizationMemberDialogComponent,
      {
        width: '500px',
        maxWidth: 'calc(100vw - 1.5rem)',
        data: {
          organizationId
        }
      }
    );

    dialogRef.afterClosed().subscribe(result => {

      if (!result) {
        return;
      }

      this.orgMemberService
        .addMember(organizationId, result)
        .subscribe();

    });
  }



}

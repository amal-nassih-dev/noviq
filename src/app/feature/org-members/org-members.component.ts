import {
  Component,
  computed,
  inject
} from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { filter, switchMap } from 'rxjs';

import { OrganizationMemberDialogComponent }
  from '../organization-member-dialog/organization-member-dialog.component';

import { OrgMemberResponse }
  from '../../core/models/organization-member/organization-member-response';

import { OrganizationRoleMember }
  from '../../core/models/organization-member/organization-role';

import { UiButtonComponent }
  from '../../shared/component/ui-button/ui-button/ui-button.component';

import { UiConfirmDialogComponent }
  from '../../shared/component/ui-confirm-dialog/ui-confirm-dialog.component';

import { OrganizationalContextService }
  from '../../core/services/organizational-context.service';
import { OrganizationMemberService } from '../../core/services/organization-member.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-org-members',
  standalone: true,
  imports: [
    MatIconModule,
    MatMenuModule,
    UiButtonComponent
  ],
  templateUrl: './org-members.component.html',
  styleUrl: './org-members.component.css'
})
export class OrgMembersComponent {

  private readonly dialog = inject(MatDialog);

  private readonly organizationContext =
    inject(OrganizationalContextService);

  private readonly memberService =
    inject(OrganizationMemberService);

  protected readonly members =
    this.organizationContext.members;

  protected readonly currentOrganization =
    this.organizationContext.currentOrganization;

  protected readonly OrganizationRoleMember =
    OrganizationRoleMember;

  private readonly notification = inject(NotificationService);

  

  protected readonly ownerCount = computed(() =>
    this.members().filter(
      member =>
        member.role === OrganizationRoleMember.OWNER
    ).length
  );

  protected readonly adminCount = computed(() =>
    this.members().filter(
      member =>
        member.role === OrganizationRoleMember.ADMIN
    ).length
  );

  protected readonly memberCount = computed(() =>
    this.members().filter(
      member =>
        member.role === OrganizationRoleMember.MEMBER
    ).length
  );

  openAddMemberDialog(): void {

    const organization =
      this.currentOrganization();

    if (!organization) {
      return;
    }

    const dialogRef = this.dialog.open(
      OrganizationMemberDialogComponent,
      {
        width: '500px',
        maxWidth: 'calc(100vw - 1.5rem)',
        data: {
          organizationId: organization.id
        }
      }
    );

    dialogRef.afterClosed()
      .pipe(
        filter(result => !!result),
        switchMap(result =>
          this.memberService.addMember(
            organization.id,
            result
          )
        )
      )
      .subscribe({
        next: () => {
          this.notification.success(
            'Member added successfully.'
          );
        }
      });
  }

  updateRole(
    member: OrgMemberResponse,
    role: OrganizationRoleMember
  ): void {

    if (member.role === role) {
      return;
    }

    const organization =
      this.currentOrganization();

    if (!organization) {
      return;
    }

    this.memberService
      .updateMember(
        organization.id,
        {
          role
        },
        member.userId
      )
      .subscribe(
        {
          next: () => {
            this.notification.success(
              'Member role updated successfully.'
            );
          }
        }
      );
  }

  deleteMember(
    member: OrgMemberResponse
  ): void {

    const organization =
      this.currentOrganization();

    if (!organization) {
      return;
    }

    const dialogRef = this.dialog.open(
      UiConfirmDialogComponent,
      {
        width: '400px',
        data: {
          title: 'Remove member',
          message:
            `Are you sure you want to remove "${member.fullName}" from this organization?`,
          confirmLabel: 'Remove',
          danger: true
        }
      }
    );

    dialogRef.afterClosed()
      .pipe(
        filter(
          confirmed => confirmed === true
        ),
        switchMap(() =>
          this.memberService.deleteMember(
            organization.id,
            member.userId
          )
        )
      )
      .subscribe({
        next: () => {
          this.notification.success(
            'Member removed successfully.'
          );
        }
      });
  }

  getInitials(
    member: OrgMemberResponse
  ): string {

    return member.fullName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(name =>
        name.charAt(0).toUpperCase()
      )
      .join('');
  }

  formatRole(
    role: OrganizationRoleMember
  ): string {

    return role.charAt(0) +
      role.slice(1).toLowerCase();
  }

  formatJoinedDate(
    date: string
  ): string {

    return new Date(date).toLocaleDateString(
      'en-US',
      {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }
    );
  }
}
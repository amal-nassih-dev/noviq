import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  computed
} from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, switchMap } from 'rxjs';

import { OrganizationMemberService } from '../../core/services/organization-member.service';
import { OrganizationMemberDialogComponent } from '../organization-member-dialog/organization-member-dialog.component';

import { OrgMemberResponse } from '../../core/models/organization-member/organization-member-response';
import { OrganizationRoleMember } from '../../core/models/organization-member/organization-role';

import { UiButtonComponent } from '../../shared/component/ui-button/ui-button/ui-button.component';
import { UiConfirmDialogComponent } from '../../shared/component/ui-confirm-dialog/ui-confirm-dialog.component';

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
export class OrgMembersComponent implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly memberService =
    inject(OrganizationMemberService);

  protected readonly members =
    this.memberService.members;

  protected readonly OrganizationRoleMember =
    OrganizationRoleMember;

  protected organizationId!: number;

  /*
   * Role counts
   */

  protected readonly ownerCount = computed(() =>
    this.members().filter(
      member => member.role === OrganizationRoleMember.OWNER
    ).length
  );

  protected readonly adminCount = computed(() =>
    this.members().filter(
      member => member.role === OrganizationRoleMember.ADMIN
    ).length
  );

  protected readonly memberCount = computed(() =>
    this.members().filter(
      member => member.role === OrganizationRoleMember.MEMBER
    ).length
  );


  ngOnInit(): void {

    this.route.paramMap
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(params => {

        const id = params.get('orgId');

        if (!id) {
          return;
        }

        this.organizationId = Number(id);

        this.loadMembers();
      });
  }


  private loadMembers(): void {

    this.memberService
      .findAll(this.organizationId)
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }


  /*
   * Add member
   */

  openAddMemberDialog(): void {

    const dialogRef = this.dialog.open(
      OrganizationMemberDialogComponent,
      {
        width: '500px',
        maxWidth: 'calc(100vw - 1.5rem)',
        data: {
          organizationId: this.organizationId
        }
      }
    );

    dialogRef.afterClosed()
      .pipe(
        filter(result => !!result),
        switchMap(result =>
          this.memberService.addMember(
            this.organizationId,
            result
          )
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }


  /*
   * Update member role
   */

  updateRole(
    member: OrgMemberResponse,
    role: OrganizationRoleMember
  ): void {

    if (member.role === role) {
      return;
    }

    this.memberService
      .updateMember(
        this.organizationId,
        {
          role
        },
        member.userId
      )
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }


  /*
   * Delete member
   */

  deleteMember(member: OrgMemberResponse): void {

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
        filter(confirmed => confirmed === true),
        switchMap(() =>
          this.memberService.deleteMember(
            this.organizationId,
            member.userId
          )
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }


  /*
   * Helpers
   */

  getInitials(member: OrgMemberResponse): string {

    return member.fullName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(name => name.charAt(0).toUpperCase())
      .join('');
  }


  formatRole(role: OrganizationRoleMember): string {

    return role.charAt(0) +
      role.slice(1).toLowerCase();
  }


  formatJoinedDate(date: string): string {

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
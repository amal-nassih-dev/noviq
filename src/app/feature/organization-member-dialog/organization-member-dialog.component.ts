import { Component, inject, signal } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { OrganizationRoleMember } from '../../core/models/organization-member/organization-role';
import { UserSearchResponse } from '../../core/models/user-search-response';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { UiButtonComponent } from '../../shared/component/ui-button/ui-button/ui-button.component';
import { OrganizationMemberDialogData } from '../../core/models/organization-member/organization-member-dialog-data';

@Component({
  selector: 'app-organization-member-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    UiButtonComponent
  ],
  templateUrl: './organization-member-dialog.component.html',
  styleUrl: './organization-member-dialog.component.css'
})
export class OrganizationMemberDialogComponent {
   private readonly userService = inject(UserService);
   private readonly fb = inject(FormBuilder);
   readonly dialogRef = inject(MatDialogRef<OrganizationMemberDialogComponent>);
   readonly data = inject(MAT_DIALOG_DATA) as OrganizationMemberDialogData;
   readonly users = this.userService.users;
   readonly roles = Object.values(OrganizationRoleMember);

   readonly selectedUser =
    signal<UserSearchResponse | null>(null);

   readonly searchControl =
    this.fb.nonNullable.control(''); 

  readonly form = this.fb.nonNullable.group({
    role: [
      OrganizationRoleMember.MEMBER,
      Validators.required
    ]
  });

  constructor() {
  this.searchControl.valueChanges
    .pipe(
      debounceTime(300),
      distinctUntilChanged(),
      // only keep string values
      filter((value): value is string => typeof value === 'string')
    )
    .subscribe(query => {
      const trimmed = query.trim();

      if (!trimmed) {
        this.userService.clear();
        this.selectedUser.set(null);
        return;
      }

      this.userService.search(trimmed).subscribe();
    });
}

selectUser(user: UserSearchResponse): void {
  this.selectedUser.set(user);

  // write only the display name, and prevent another emission
  this.searchControl.setValue(user.fullName, { emitEvent: false });
}

displayUser = (user: UserSearchResponse | string): string => {
  if (!user) return '';
  return typeof user === 'string' ? user : user.fullName;
};


  clearUser(): void {
    this.selectedUser.set(null);
    this.searchControl.setValue('');
  }

  close(): void {
    this.dialogRef.close();
  }

  addMember(): void {
    const user = this.selectedUser();
    if (!user || this.form.invalid) {
      return;
    }
    this.dialogRef.close({
      email: user.email,
      role: this.form.getRawValue().role
    });
  }
   
}

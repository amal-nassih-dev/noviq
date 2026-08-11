import {
  Component,
  computed,
  inject,
  signal
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { UiInputComponent } from '../../../shared/component/ui-input/ui-input.component';
import { UiButtonComponent } from '../../../shared/component/ui-button/ui-button/ui-button.component';

import { TaskResponse } from '../../../core/models/task/task-response';
import { OrgMemberResponse } from '../../../core/models/organization-member/organization-member-response';
import { TaskStatus } from '../../../core/models/task/task-status';
import { TaskPriority } from '../../../core/models/task/task-priority';

import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MatNativeDateModule,
  provideNativeDateAdapter
} from '@angular/material/core';

export interface TaskDialogData {
  task: TaskResponse | null;
  members: OrgMemberResponse[];
}

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    UiInputComponent,
    UiButtonComponent,
    ReactiveFormsModule
  ],
  templateUrl: './task-dialog.component.html',
  styleUrl: './task-dialog.component.css',
  providers:[provideNativeDateAdapter()]
})
export class TaskDialogComponent {

  protected readonly fb = inject(FormBuilder);

  readonly dialogRef = inject(MatDialogRef<TaskDialogComponent>);

  readonly data = inject<TaskDialogData>(MAT_DIALOG_DATA);

  readonly task = this.data.task;
  readonly members = this.data.members;

  readonly isEditMode = computed(() => !!this.task);

  readonly statuses = Object.values(TaskStatus);
  readonly priorities = Object.values(TaskPriority);

  readonly form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    description: [''],
    status: [TaskStatus.TODO, Validators.required],
    priority: [TaskPriority.MEDIUM, Validators.required],
    dueDate: [null as Date | null],
    assigneeId: [null as number | null]
  });

  readonly assigneeSearch = this.fb.nonNullable.control('');

  readonly searchValue = signal('');

  readonly filteredMembers = computed(() => {
    const search = this.searchValue()
      .toLowerCase()
      .trim();

    if (!search) {
      return this.members;
    }

    return this.members.filter(member =>
      member.fullName.toLowerCase().includes(search) ||
      member.email.toLowerCase().includes(search)
    );
  });

  constructor() {

    this.assigneeSearch.valueChanges.subscribe(value => {
      this.searchValue.set(value);
    });

    if (this.task) {
      this.form.patchValue({
        title: this.task.title,
        description: this.task.description ?? '',
        status: this.task.status,
        priority: this.task.priority,
        dueDate: this.task.dueDate
          ? new Date(this.task.dueDate + 'T00:00:00')
          : null,
        assigneeId: this.task.assigneeId
      });

      const assignedMember = this.members.find(
        member => member.userId === this.task?.assigneeId
      );

      if (assignedMember) {
        this.assigneeSearch.setValue(
          assignedMember.fullName,
          { emitEvent: false }
        );
      }
    }
  }

  selectAssignee(member: OrgMemberResponse): void {

    this.form.patchValue({
      assigneeId: member.userId
    });

    this.assigneeSearch.setValue(member.fullName);
  }

  clearAssignee(): void {

    this.form.patchValue({
      assigneeId: null
    });

    this.assigneeSearch.setValue('');
  }

  close(): void {
    this.dialogRef.close();
  }

  save(): void {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    const dueDate = value.dueDate
      ? this.formatDate(value.dueDate)
      : null;

    this.dialogRef.close({
      ...value,
      dueDate
    });
  }

  private formatDate(date: string | Date): string {
    if (typeof date === 'string') {
      return date;
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TaskResponse } from '../../../core/models/task/task-response';
import { TaskPriority } from '../../../core/models/task/task-priority';
import { MatIconModule } from '@angular/material/icon';
import { OrgMemberResponse } from '../../../core/models/organization-member/organization-member-response';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [
    DatePipe,
    MatIconModule
  ],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.css'
})
export class TaskCardComponent {
  @Input({ required: true }) task!: TaskResponse;
  @Output() edit = new EventEmitter<TaskResponse>();
  @Input({ required: true }) members!: OrgMemberResponse[];

  priorityClass(p: TaskPriority | string): string {
    return `priority priority--${String(p).toLowerCase()}`;
  }

  getAssignee(task: TaskResponse): OrgMemberResponse | undefined {
    if (!task.assigneeId) {
      return undefined;
    }

    return this.members.find(
      member => member.userId === task.assigneeId
    );
  }

  getMemberInitials(member: OrgMemberResponse): string {
    const names = member.fullName.trim().split(/\s+/);

    if (names.length === 1) {
      return names[0].substring(0, 2).toUpperCase();
    }

    return (
      names[0].charAt(0) +
      names[names.length - 1].charAt(0)
    ).toUpperCase();
  }

  isOverdue(task: TaskResponse): boolean {
    if (!task.dueDate) {
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(`${task.dueDate}T00:00:00`);
    return dueDate < today;
  }

}
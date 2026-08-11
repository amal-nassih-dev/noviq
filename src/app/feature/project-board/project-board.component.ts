import { Component, OnInit, computed, inject, signal, DestroyRef } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';

import { TaskService } from '../../core/services/task.service';
import { ProjectService } from '../../core/services/project.service';
import { TaskResponse } from '../../core/models/task/task-response';
import { TaskStatus } from '../../core/models/task/task-status';
import { TaskPriority } from '../../core/models/task/task-priority';
import { ProjectResponse } from '../../core/models/project/project-response';
import { UiButtonComponent } from '../../shared/component/ui-button/ui-button/ui-button.component';
import { TaskCardComponent } from '../task/task-card/task-card.component';
import { TaskDialogComponent } from '../task/task-dialog/task-dialog.component';
import { BoardColumn } from '../../core/models/task/board-column';
import { OrganizationMemberService } from '../../core/services/organization-member.service';
import { OrgMemberResponse } from '../../core/models/organization-member/organization-member-response';

@Component({
  selector: 'app-project-board',
  standalone: true,
  imports: [
    DragDropModule,
    MatIconModule,
    RouterLink,
    UiButtonComponent,
    TaskCardComponent
  ],
  templateUrl: './project-board.component.html',
  styleUrl: './project-board.component.css'
})
export class ProjectBoardComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly taskService = inject(TaskService);
  private readonly orgMemberService = inject(OrganizationMemberService);
  private readonly projectService = inject(ProjectService);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);
  readonly members = this.orgMemberService.members;

  orgId = signal(0);
  projectId = signal(0);
  project = signal<ProjectResponse | null>(null);
  loading = signal(true);

  tasks = this.taskService.tasks;

  columns = computed<BoardColumn[]>(() => {
    const all = this.tasks();
    const statuses: { id: TaskStatus; title: string }[] = [
      { id: TaskStatus.BACKLOG, title: 'Backlog' },
      { id: TaskStatus.TODO, title: 'To Do' },
      { id: TaskStatus.IN_PROGRESS, title: 'In Progress' },
      { id: TaskStatus.REVIEW, title: 'Review' },
      { id: TaskStatus.DONE, title: 'Done' }
    ];

    return statuses.map(s => ({
      ...s,
      tasks: all
        .filter(t => t.status === s.id)
        .sort((a, b) => a.position - b.position)
    }));
  });

  totalTasks = computed(() => this.tasks().length);
  doneTasks = computed(() => this.tasks().filter(t => t.status === TaskStatus.DONE).length);
  progress = computed(() => {
    const total = this.totalTasks();
    if (total === 0) return 0;
    return Math.round((this.doneTasks() / total) * 100);
  });

  // connected lists for CDK
  connectedDropLists = computed(() =>
    this.columns().map(c => c.id)
  );

  ngOnInit(): void {
     this.route.paramMap
    .pipe(
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe(params => {
      const orgId = Number(params.get('orgId'));
      const projectId = Number(params.get('projectId'));

      if (!orgId || !projectId) {
        return;
      }

      this.orgId.set(orgId);
      this.projectId.set(projectId);

      this.projectService.findProject(orgId, projectId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(p => this.project.set(p));

      this.taskService.findAll(orgId, projectId)
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();

       this.orgMemberService.findAll(orgId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
    });
  }

  drop(event: CdkDragDrop<TaskResponse[]>, newStatus: TaskStatus): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }

    const task = event.container.data[event.currentIndex];
    const payload = {
      title: task.title,
      description: task.description,
      status: newStatus,
      priority: task.priority,
      position: event.currentIndex,
      dueDate: task.dueDate,
      assigneeId: task.assigneeId
    };

    this.taskService
      .updateTask(this.orgId(), this.projectId(), payload, task.id)
      .subscribe();
  }

  openCreateTask(status: TaskStatus = TaskStatus.TODO): void {
    console.log(status);
    this.dialog.open(TaskDialogComponent, {
      width: '520px',
      panelClass: 'task-dialog',
      data: {
        task: null,
        members: this.orgMemberService.members()
      }
    }).afterClosed().subscribe(result => {
      if (!result) return;
      this.taskService.addTask(this.orgId(), this.projectId(), {
        ...result,
        status: result.status || status
      }).subscribe( ()=>{
         // Refresh project list so taskCount changes
          this.projectService
            .findAll(this.orgId())
            .pipe(
              takeUntilDestroyed(this.destroyRef)
            )
            .subscribe();
      }

      );
    });
  }

  openEditTask(task: TaskResponse): void {
    this.dialog.open(TaskDialogComponent, {
      width: '520px',
      panelClass: 'task-dialog',
      data: {
        task: task,
        members: this.orgMemberService.members()
      }
    }).afterClosed().subscribe(result => {
      if (!result) return;
      this.taskService.updateTask(
        this.orgId(),
        this.projectId(),
        result,
        task.id
      ).subscribe();
    });
  }

  goBack(): void {
    this.router.navigate(['/organizations', this.orgId(), 'projects']);
  }

}
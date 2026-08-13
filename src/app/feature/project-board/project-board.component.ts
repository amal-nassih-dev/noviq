import {
  Component,
  OnInit,
  computed,
  inject,
  signal,
  DestroyRef
} from '@angular/core';

import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import {
  DragDropModule,
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';

import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';

import { TaskService } from '../../core/services/task.service';
import { ProjectService } from '../../core/services/project.service';
import { OrganizationMemberService } from '../../core/services/organization-member.service';

import { TaskResponse } from '../../core/models/task/task-response';
import { TaskStatus } from '../../core/models/task/task-status';
import { ProjectResponse } from '../../core/models/project/project-response';
import { BoardColumn } from '../../core/models/task/board-column';

import { UiButtonComponent } from '../../shared/component/ui-button/ui-button/ui-button.component';
import { TaskCardComponent } from '../task/task-card/task-card.component';
import { TaskDialogComponent } from '../task/task-dialog/task-dialog.component';
import { NotificationService } from '../../core/services/notification.service';

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
  private readonly projectService = inject(ProjectService);
  private readonly orgMemberService = inject(OrganizationMemberService);
  private readonly notification = inject(NotificationService);

  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  readonly members = this.orgMemberService.members;

  readonly orgId = signal(0);
  readonly projectId = signal(0);

  readonly project =
    signal<ProjectResponse | null>(null);

  readonly loading =
    signal(true);

  readonly tasks =
    this.taskService.tasks;

  readonly columns =
    computed<BoardColumn[]>(() => {

      const allTasks = this.tasks();

      const statuses: {
        id: TaskStatus;
        title: string;
      }[] = [
        {
          id: TaskStatus.BACKLOG,
          title: 'Backlog'
        },
        {
          id: TaskStatus.TODO,
          title: 'To Do'
        },
        {
          id: TaskStatus.IN_PROGRESS,
          title: 'In Progress'
        },
        {
          id: TaskStatus.REVIEW,
          title: 'Review'
        },
        {
          id: TaskStatus.DONE,
          title: 'Done'
        }
      ];

      return statuses.map(status => ({
        ...status,
        tasks: allTasks
          .filter(task => task.status === status.id)
          .sort(
            (a, b) =>
              a.position - b.position
          )
      }));
    });

  readonly totalTasks =
    computed(() => this.tasks().length);

  readonly doneTasks =
    computed(() =>
      this.tasks().filter(
        task => task.status === TaskStatus.DONE
      ).length
    );

  readonly progress =
    computed(() => {

      const total = this.totalTasks();

      if (total === 0) {
        return 0;
      }

      return Math.round(
        (this.doneTasks() / total) * 100
      );
    });

  readonly connectedDropLists =
    computed(() =>
      this.columns().map(column => column.id)
    );

  ngOnInit(): void {

    this.route.paramMap
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(params => {

        const orgId =
          Number(params.get('orgId'));

        const projectId =
          Number(params.get('projectId'));

        if (!orgId || !projectId) {
          return;
        }

        this.orgId.set(orgId);
        this.projectId.set(projectId);

        this.projectService
          .findProject(orgId, projectId)
          .pipe(
            takeUntilDestroyed(this.destroyRef)
          )
          .subscribe(project => {
            this.project.set(project);
          });

        this.taskService
          .findAll(orgId, projectId)
          .pipe(
            finalize(() =>
              this.loading.set(false)
            ),
            takeUntilDestroyed(this.destroyRef)
          )
          .subscribe();

        this.orgMemberService
          .findAll(orgId)
          .pipe(
            takeUntilDestroyed(this.destroyRef)
          )
          .subscribe();
      });
  }

  drop(
    event: CdkDragDrop<TaskResponse[]>,
    newStatus: TaskStatus
  ): void {

    if (
      event.previousContainer ===
      event.container
    ) {

      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

    } else {

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }

    const task =
      event.container.data[event.currentIndex];

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
      .updateTask(
        this.orgId(),
        this.projectId(),
        payload,
        task.id
      )
      .subscribe();
  }

  openCreateTask(
    status: TaskStatus = TaskStatus.TODO
  ): void {

    this.dialog
      .open(TaskDialogComponent, {
        width: '32.5rem',
        maxWidth: 'calc(100vw - 2rem)',
        panelClass: 'task-dialog',
        data: {
          task: null,
          members: this.members()
        }
      })
      .afterClosed()
      .subscribe(result => {

        if (!result) {
          return;
        }

        this.taskService
          .addTask(
            this.orgId(),
            this.projectId(),
            {
              ...result,
              status:
                result.status || status
            }
          )
          .subscribe({
            next: () => {
              this.notification.success(
                'Task created successfully.'
              );
            }
          });
      });
  }

  openEditTask(
    task: TaskResponse
  ): void {

    this.dialog
      .open(TaskDialogComponent, {
        width: '32.5rem',
        maxWidth: 'calc(100vw - 2rem)',
        panelClass: 'task-dialog',
        data: {
          task,
          members: this.members()
        }
      })
      .afterClosed()
      .subscribe(result => {

        if (!result) {
          return;
        }

        this.taskService
          .updateTask(
            this.orgId(),
            this.projectId(),
            result,
            task.id
          )
          .subscribe(
            {
              next: () => {
                this.notification.success(
                  'Task updated successfully.'
                );
              }
            }
          );
      });
  }

  goBack(): void {

    this.router.navigate([
      '/organizations',
      this.orgId(),
      'projects'
    ]);
  }
}
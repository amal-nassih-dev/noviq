import { Component, inject, computed } from '@angular/core';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { Router, RouterLink } from '@angular/router';
import { OrganizationalContextService } from '../../../core/services/organizational-context.service';
import { ProjectResponse } from '../../../core/models/project/project-response';

@Component({
  selector: 'app-dashboard',
  imports: [
    RouterLink
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  protected authenticationService = inject(AuthenticationService);
  private readonly router = inject(Router);
  private readonly organizationContext =
    inject(OrganizationalContextService);

  readonly currentOrganization =
    this.organizationContext.currentOrganization;

  readonly projects =
    this.organizationContext.projects;

  readonly members =
    this.organizationContext.members;

  readonly projectCount = computed(() =>
    this.projects().length
  );

   /*
   * Total number of tasks across all projects.
   */
  readonly taskCount = computed(() =>
    this.projects().reduce(
      (total, project) =>
        total + (project.taskCount ?? 0),
      0
    )
  );

   /*
   * Total completed tasks.
   */
  readonly doneTaskCount = computed(() =>
    this.projects().reduce(
      (total, project) =>
        total + (project.doneTaskCount ?? 0),
      0
    )
  );

  /*
   * Active tasks.
   */
  readonly activeTaskCount = computed(() =>
    this.taskCount() - this.doneTaskCount()
  );

   /*
   * Overall completion percentage.
   */
  readonly progress = computed(() => {

    const total = this.taskCount();

    if (total === 0) {
      return 0;
    }

    return Math.round(
      (this.doneTaskCount() / total) * 100
    );
  });

  /*
   * Projects displayed on dashboard.
   */
  readonly recentProjects = computed(() =>
    this.projects().slice(0, 4)
  );

  logout(): void{
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  private readonly PROJECT_COLORS = [
      '#6366F1', // Indigo
      '#8B5CF6', // Violet
      '#EC4899', // Pink
      '#EF4444', // Red
      '#F97316', // Orange
      '#F59E0B', // Amber
      '#10B981', // Emerald
      '#14B8A6', // Teal
      '#06B6D4', // Cyan
      '#3B82F6'  // Blue
    ];
  
    getProjectColor(project: ProjectResponse): string {
      return this.PROJECT_COLORS[
        project.id % this.PROJECT_COLORS.length
      ];
    }

}

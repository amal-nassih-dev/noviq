import { Component, inject, computed } from '@angular/core';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { Router, RouterLink } from '@angular/router';
import { OrganizationalContextService } from '../../../core/services/organizational-context.service';

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

}

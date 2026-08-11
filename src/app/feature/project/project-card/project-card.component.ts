import { Component, EventEmitter, Input, Output , inject} from '@angular/core';
import { ProjectResponse } from '../../../core/models/project/project-response';
import { UiCardComponent } from '../../../shared/component/ui-card/ui-card.component';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-card',
  imports: [
    UiCardComponent,
    MatIconModule
  ],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.css'
})
export class ProjectCardComponent {
  private readonly router = inject(Router);

  @Input({required:true})
  project!:ProjectResponse;
  
  @Output()
  edit = new EventEmitter<ProjectResponse>();

  @Output()
  delete = new EventEmitter<ProjectResponse>();

  get progress(): number {
    const total = this.project.taskCount ?? 0;
    const done = this.project.doneTaskCount ?? 0;
    if (total === 0) return 0;
    return Math.round((done / total) * 100);
  }

  openBoard(): void {
    this.router.navigate([
      '/organizations',
      this.project.organizationId,
      'projects',
      this.project.id
    ]);
  }
}

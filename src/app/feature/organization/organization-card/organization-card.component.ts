import { Component, Input, inject, Output, EventEmitter} from '@angular/core';
import { OrganizationResponse } from '../../../core/models/organization/organization-response';
import { UiCardComponent } from '../../../shared/component/ui-card/ui-card.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-organization-card',
  imports: [
    UiCardComponent,
    MatIconModule,
    MatMenuModule,
    DatePipe,
    MatDividerModule
  ],
  templateUrl: './organization-card.component.html',
  styleUrl: './organization-card.component.css'
})
export class OrganizationCardComponent {

  protected readonly router = inject(Router);

   @Input({required:true})
   organization!:OrganizationResponse;

  @Output()
  edit = new EventEmitter<OrganizationResponse>();

  @Output()
  delete = new EventEmitter<OrganizationResponse>();

  @Output()
  addMember = new EventEmitter<OrganizationResponse>(); 

  getInitials(name: string): string {
    if (!name?.trim()) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  openDetails(): void {
    // navigate to organization details / projects
    this.router.navigate(['/organizations', this.organization.id, 'projects']);
  }


}

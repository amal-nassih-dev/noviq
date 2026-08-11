import {
  Component,
  inject,
  OnInit
} from '@angular/core';

import { RouterOutlet } from '@angular/router';

import { NavBarComponent } from '../../nav-bar/nav-bar.component';
import { SideBarComponent } from '../../side-bar/side-bar.component';

import { OrganizationalContextService }
  from '../../../core/services/organizational-context.service';

import { OrganizationService }
  from '../../../core/services/organization.service';


@Component({
  selector: 'app-app-layout',

  imports: [
    RouterOutlet,
    NavBarComponent,
    SideBarComponent
  ],

  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.css'
})
export class AppLayoutComponent implements OnInit {

  private readonly organizationContext =
    inject(OrganizationalContextService);

  private readonly organizationService =
    inject(OrganizationService);


  ngOnInit(): void {

    this.organizationService
      .getAll()
      .subscribe(() => {
        this.organizationContext.initialize();
      });
  }
}
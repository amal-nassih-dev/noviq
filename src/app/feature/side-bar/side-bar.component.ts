import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-side-bar',
  imports: [
    RouterLink,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent {
   readonly items = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/'
    },
    {
      label: 'Organizations',
      icon: 'groups',
      route: '/organizations'
    },
    {
      label: 'Projects',
      icon: 'folder',
      route: '/projects'
    },
    {
      label: 'Tasks',
      icon: 'task',
      route: '/tasks'
    },
    {
      label: 'Settings',
      icon: 'settings',
      route: '/settings'
    }
  ];

  isCollapsed = signal(false);

  toggle() {
    this.isCollapsed.update(v => !v);
  }


}

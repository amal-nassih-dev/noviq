import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from '../../nav-bar/nav-bar.component';
import { SideBarComponent } from '../../side-bar/side-bar.component';

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
export class AppLayoutComponent {
}

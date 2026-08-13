import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-ui-button',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './ui-button.component.html',
  styleUrl: './ui-button.component.css'
})
export class UiButtonComponent {

  @Input()
  label = '';

  @Input()
  type: 'button' | 'submit' = 'button';

  @Input()
  color: 'primary' | 'accent' | 'warn' = 'primary';

  @Input()
  disabled = false;

  @Input() variant: 'primary' | 'secondary' | 'ghost' = 'primary';

  @Input() icon : string | null= null;

  @Input() position: 'left' | 'right'= 'left';

}
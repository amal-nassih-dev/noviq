import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-ui-button',
  standalone: true,
  imports: [
    MatButtonModule
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

}
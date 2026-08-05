import { Component, Input, signal, forwardRef, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';

@Component({
  selector: 'app-ui-password-input',
  imports: [
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './ui-password-input.component.html',
  styleUrl: './ui-password-input.component.css',
  providers : [
    // {
    //   provide: NG_VALUE_ACCESSOR,
    //   useExisting : forwardRef(()=>UiPasswordInputComponent),
    //   multi : true
    // }
  ]
})
export class UiPasswordInputComponent implements ControlValueAccessor{
  
  protected hidePassword = signal(true);

  protected ngControl = inject(NgControl, {
    optional : true, 
  });

  constructor() {
    if (this.ngControl) {
        this.ngControl.valueAccessor = this;
    }
  }

  @Input()
  label = '';

  @Input()
  placeholder ='';

  @Input()
  autocomplete = 'current-password';

  @Input() disabled = false;

  toggleVisibility() {
    this.hidePassword.update(value => !value);
  }

  protected value = signal('') ;

  private onChange: (value: string) => void = () => {}; 
  private onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.value.set(value ?? '');
  }
  registerOnChange(fn: (value: string)=> void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void ): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  handleInput(event: Event): void{
      const input = event.target as HTMLInputElement;
      this.value.set(input.value);
      this.onChange(this.value());
  }

  handleBlur():void{
    this.onTouched();
  }

  get control() {
    return this.ngControl?.control;
  }

  get showError(): boolean {
  return !!(
    this.control?.invalid &&
    this.control?.touched
  );
}

  protected get errorMessage(): string {
  if (this.control?.errors?.['server']) {
    return this.control.errors['server'];
  }

  if (this.control?.errors?.['required']) {
    return `${this.label} is required`;
  }

  if (this.control?.errors?.['email']) {
    return 'Please enter a valid email';
  }

  if (this.control?.errors?.['minlength']) {
    return `Minimum ${this.control.errors['minlength'].requiredLength} characters`;
  }

  if (this.control?.errors?.['passwordMismatch']) {
    return 'Passwords do not match';
  }

  return '';
}
}
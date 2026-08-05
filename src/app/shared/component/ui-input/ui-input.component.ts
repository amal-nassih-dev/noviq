import { Component, Input, forwardRef, inject, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgControl } from '@angular/forms';


@Component({
  selector: 'app-ui-input',
  standalone: true,

  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],

  templateUrl: './ui-input.component.html',
  styleUrl: './ui-input.component.css',
  providers : [
    // {
    //   provide: NG_VALUE_ACCESSOR, // this is to tell angular Who is the value accessor for this component if it is accessed by someone outside
    //   useExisting : forwardRef(() => UiInputComponent), // forwardRef : this means dont use the class until it exists 
    //   multi: true
    // }
  ]
})
export class UiInputComponent implements ControlValueAccessor { // implementing this will make this behave like a form control we needed to implement 4 methods

  protected ngControl = inject(NgControl, {
    optional : true, // means if there is no formControlName it is okay to not inject this one
    host : true 
  });

  constructor() {
    if (this.ngControl) {
        this.ngControl.valueAccessor = this;
    }
  }

  @Input()
  label = '';

  @Input()
  placeholder = '';

  @Input()
  type: string = 'text';

  @Input()
  icon = '';

  @Input()
  autocomplete = '';

  protected readonly value = signal('');

  protected readonly disabled = signal(false);

  private onChange: (value: string) => void = () => {}; // we need this to be initialized as an empty arrow function to be registered in the registerOnChange
  
  private onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn:  () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  handleInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.value.set(input.value);
    this.onChange(this.value()); // so that angular knows that a change has happened 
  }

  handleBlur(): void {
    this.onTouched(); // btw blur is the even when the input loses focus
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

  return '';
}

  

}
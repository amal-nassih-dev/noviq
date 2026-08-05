import { Component, inject, DestroyRef, signal} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { UiButtonComponent } from '../../../shared/component/ui-button/ui-button/ui-button.component';
import { UiInputComponent } from '../../../shared/component/ui-input/ui-input.component';
import { UiPasswordInputComponent } from '../../../shared/component/ui-password-input/ui-password-input.component';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { RouterLink } from '@angular/router';
import { ApiError } from '../../../core/models/auth/api-error';
import { AuthStateService } from '../../../core/services/auth-state.service';

@Component({
  selector: 'app-login',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    ReactiveFormsModule,
    UiButtonComponent,
    UiInputComponent,
    UiPasswordInputComponent,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  
  private formBuilder = inject(FormBuilder);
  private readonly authenticationService = inject(AuthenticationService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly isLoading = signal(false);
  protected readonly authStateService = inject(AuthStateService);
  protected readonly errorMessage = signal('');
  
  loginForm = this.formBuilder.nonNullable.group({
    email : [
      '',
      [
        Validators.email,
        Validators.required
      ]
    ],
    password : [
      '',
      [
        Validators.required,
        Validators.minLength(8)
      ]
    ]
  });

  onSubmit() {
    if (this.loginForm.invalid){
       this.loginForm.markAllAsTouched(); // because invalid + touched => need to show error
       return;
    }
    this.isLoading.set(true);
    const request = this.loginForm.getRawValue(); // that returns a LoginRequest
    this.authenticationService.login(request).pipe(
      finalize(() => this.isLoading.set(false)),
      takeUntilDestroyed(this.destroyRef) // Angular automatically unsubscribes when the component is destroyed.
    ).subscribe(
      {
        next: response => {
            this.authStateService.login(response);
            this.router.navigate(['/']); // navigate
        },
        error : err => {
          const apiError = err.error as ApiError;
          if (apiError.fieldErrors?.length) {
            apiError.fieldErrors.forEach(fieldError => {
              this.loginForm.get(fieldError.field)?.setErrors({
                server: fieldError.message
              });
            });

            this.errorMessage.set('');
          } else {
            this.errorMessage.set(apiError.message);
          }
        }
      }
    )
  }
  

}

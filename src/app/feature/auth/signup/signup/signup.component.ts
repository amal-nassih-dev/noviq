import { Component, inject, DestroyRef, signal} from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { UiInputComponent } from '../../../../shared/component/ui-input/ui-input.component';
import { UiPasswordInputComponent } from '../../../../shared/component/ui-password-input/ui-password-input.component';
import { UiButtonComponent } from '../../../../shared/component/ui-button/ui-button/ui-button.component';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../../../../core/services/authentication.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { passwordsMatchValidator } from '../../../../shared/validators/passwords-match.validator';
import { ApiError } from '../../../../core/models/auth/api-error';
import { AuthStateService } from '../../../../core/services/auth-state.service';
import { ErrorHandlerService } from '../../../../core/services/error-handler.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-signup',
  imports: [
    UiInputComponent,
    UiPasswordInputComponent,
    UiButtonComponent,
    FormsModule,
    ReactiveFormsModule,
    RouterLink
],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  protected readonly formBuilder = inject(FormBuilder);
  protected readonly authenticationService = inject(AuthenticationService);
  protected readonly destroyRef = inject(DestroyRef);
  protected readonly router = inject(Router);
  protected readonly errorMessage = signal('');
  protected readonly loading = signal(false);
  protected readonly authStateService = inject(AuthStateService);
  private readonly errorHandler = inject(ErrorHandlerService);

  protected signupForm = this.formBuilder.nonNullable.group({
    email : ['', [
       Validators.required,
       Validators.email
    ]],
    fullName : [
      '',
      [
        Validators.required
      ]
    ],
    password: ['',
      [
        Validators.required,
        Validators.minLength(8)
      ]
    ],
    confirmPassword: ['',
      [
        Validators.required
      ]
    ]
  },
  {
    validators: passwordsMatchValidator()
  });


  onSubmit(): void{

    if (this.signupForm.invalid){
      this.signupForm.markAllAsTouched();
      return;
    }

     this.loading.set(true);

    const {
        confirmPassword,
        ...request
    } = this.signupForm.getRawValue();

    this.authenticationService.signup(request).pipe(
       takeUntilDestroyed(this.destroyRef),
        finalize(() =>
          this.loading.set(false)
        )
    ).subscribe({
      next: (response) => {
         this.authStateService.setAuthentication(
          response.token,
          response.user
        );

         this.router.navigate(['/']);
      },
      error: (err) => {
        const fieldErrors =
          this.errorHandler.getFieldErrors(err);

        if (fieldErrors.length > 0) {

          fieldErrors.forEach(fieldError => {

            this.signupForm
              .get(fieldError.field)
              ?.setErrors({
                server: fieldError.message
              });

          });

          this.errorMessage.set('');

          return;
        }

        this.errorMessage.set(
          this.errorHandler.getMessage(
            err,
            'Unable to create your account. Please try again.'
          )
        );
      }
    })
  }


}

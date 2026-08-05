import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordsMatchValidator(): ValidatorFn {
  return (form: AbstractControl): ValidationErrors | null => {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({
        ...(confirmPassword.errors ?? {}),
        passwordMismatch: true
      });
    } else if (confirmPassword.hasError('passwordMismatch')) {
      const { passwordMismatch, ...errors } = confirmPassword.errors ?? {};
      confirmPassword.setErrors(Object.keys(errors).length ? errors : null);
    }

    return null;
  };
}
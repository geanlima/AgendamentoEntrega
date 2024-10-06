import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Credencial } from '@shared/models';
import { AuthService } from '@shared/services';
import { ErrorMatcher } from '@shared/utils';
import { first } from 'rxjs';
import { MatchPassword } from '../../validators/match-password.validator';
import { AuthError } from '../../models/auth-error';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResetPasswordComponent {
  loading = false;
  submitted = false;
  errorMatcher: ErrorMatcher;
  resetPasswordForm: FormGroup;
  errors: AuthError = new AuthError();

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
  ) {
    this.errorMatcher = new ErrorMatcher();
    this.resetPasswordForm = this.createLoginForm();
  }

  createLoginForm(): FormGroup {
    return this.fb.group({
      senhaNova: ['', Validators.required],
      senhaAtual: ['', Validators.required],
      confirmacaoSenhaNova: ['', Validators.required],
    }, { validators: MatchPassword }
    );
  }

  onSubmit() {
    this.submitted = true;

    if (this.resetPasswordForm['invalid']) {
      this.errors.match = this.resetPasswordForm.hasError('match');
      return;
    }

    const credencial = new Credencial(this.resetPasswordForm['value']);

    this.loading = true;
    this.authService.signIn(credencial)
        .pipe(first())
        .subscribe({
          next: () => this.router.navigate(['home']),
          error: (e) => console.error(e),
        });
  }
}

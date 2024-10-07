import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Credencial } from '@shared/models';
import { AuthService, DialogService, NotificationService, StorageService } from '@shared/services';
import { first } from 'rxjs';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';
import { TypeToast } from '@shared/enums';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginFormComponent {
  loginForm: FormGroup;
  submitted = false;
  error = '';
  tipoLogin = '';

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private dialog: DialogService,
    private authService: AuthService,
    private storageService: StorageService,
    private notificationService: NotificationService
  ) {
    if (this.storageService.getUsuario()) {
      this.router.navigate(['/']);
    }

    this.loginForm = this.createLoginForm(new Credencial());
  }

  createLoginForm(credential: Credencial): FormGroup {
    return this.fb.group({
      user: [credential.user, Validators.required],
      password: [credential.password, Validators.required],
    });
  }

  // Função para validar se é CNPJ
  isCNPJ(user: string): boolean {
    const cnpjPattern = /^\d{14}$/; // CNPJ tem 14 dígitos numéricos
    return cnpjPattern.test(user.replace(/\D/g, '')); // Remover caracteres não numéricos para validar
  }

  onOpenModalForgotPassword(): void {
    this.dialog.show(ResetPasswordComponent);
  }

  onSubmit() {

    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    const credencial = new Credencial(this.loginForm.value);
    credencial.user = credencial.user.toUpperCase();
    
    this.authService.signInVp4(credencial)
      .pipe(first())
      .subscribe({
        next: () => {
          this.tipoLogin = (this.storageService.getUsuario()).tipo

          if(this.tipoLogin == "F"){
            this.router.navigate(['/home/agendamento']); 
          }
        },
        error: (e: { message: string }) => {
          this.notificationService.showToastPosition(
            {
              message: "CNPJ ou senha inválidos",
              typeToast: TypeToast.ERROR
            }, 'right'
          );
          this.loginForm.reset();
        },
      });
  }
}

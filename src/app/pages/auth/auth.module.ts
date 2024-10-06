import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';

import { AuthComponent } from './auth.component';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { SharedModule } from '@shared/modules';
import { AuthService } from '@shared/services';
import { AuthInterceptor } from '@core/auth';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';


@NgModule({
  declarations: [
    AuthComponent,
    LoginFormComponent,
    ResetPasswordComponent
  ],
  imports: [
    CommonModule,
    MatInputModule,
    MatButtonModule,
    AuthRoutingModule,
    MatCheckboxModule,
    MatFormFieldModule,
    SharedModule,
  ],
  providers: [
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
})
export class AuthModule { }

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthUtils } from '@core/auth';
import { Credencial, PasswordReset, Usuario } from '@shared/models';

import { Observable, of, switchMap, take, throwError } from 'rxjs';
import { BaseService } from './base.service';
import { StorageService } from './export';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseService {
  override url: string = 'authentication';

  constructor(
    httpCliente: HttpClient,
    private storageService: StorageService
  ) {
    super(httpCliente);
  }

  signIn(credential: Credencial): Observable<boolean> {
    if (this.isLoggedIn()) {
      return throwError(() => new Error('Usuário já logado.'));
    }

    return this.post<Credencial, Usuario>(credential)
      .pipe(
        switchMap((usuario: Usuario) => {
          this.storageService.saveUsuario(usuario);
          this.storageService.saveToken(usuario.token);

          return of(true);
        })
    );
  }

  signInVp4(credential: Credencial): Observable<boolean> {

    console.log("credential", credential)
    this.url += "/vp4"; 
    if (this.isLoggedIn()) {
      return throwError(() => new Error('Usuário já logado.'));
    }

    return this.post<Credencial, Usuario>(credential)
      .pipe(
        switchMap((usuario: Usuario) => {
          this.storageService.saveUsuario(usuario);
          this.storageService.saveToken(usuario.token);

          

          return of(true);
        })
    );
  }

  isLoggedIn() {
    const token = this.storageService.getToken();

    if (token) {
      return !AuthUtils.isTokenExpired(token);
    }

    return false;
  }

  signOut(): void {
    this.storageService.removeToken();
  }

  esqueciSenha(emailUsuario: string): Observable<any> {
    this.url = 'usuario/esquecisenha';
    return this.post<any, number>({ email: emailUsuario }).pipe(take(1));
  }

  alterarSenha(usuarioAtualizacaoSenha: PasswordReset): Observable<number> {
    this.url = 'usuario/alterarsenha';
    return this.put<PasswordReset, number>(usuarioAtualizacaoSenha).pipe(take(1));
  }
}

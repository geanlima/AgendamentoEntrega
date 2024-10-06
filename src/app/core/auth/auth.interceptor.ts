import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService, NotificationService, StorageService } from '@shared/services';
import { AuthUtils } from '@core/auth';
import { TypeToast } from '@shared/enums';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(
        private _authService: AuthService,
        private storageService: StorageService,
        private _notificationService: NotificationService
    ) { }

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const token = this.storageService.getToken();

        if (!token) {
            return next.handle(req);
        }

        let clonedReq = req.clone();
        if (!AuthUtils.isTokenExpired(token)) {
            clonedReq = req.clone({
                headers: req.headers.set('Authorization', 'Bearer ' + token)
                //headers: req.headers.set('Authorization', token)
            });
        }

        return next.handle(clonedReq).pipe(
            catchError((error) => {

                if (error instanceof HttpErrorResponse) {

                    if (error.status === 401) {

                        this._authService.signOut();
                        location.reload();
                    }

                    if (error.status === 0 && error.ok === false) {

                        this._notificationService.showToast({
                            message: "Falha ao conectar com o servidor",
                            typeToast: TypeToast.ERROR
                        });
                    }
                }

                //Exibe erros do backend
                if (error) {
                    if (error.error && error.error.data && error.error.data[0].message) {
                        this._notificationService.showToast({
                            message: error.error.data[0].message,
                            typeToast: TypeToast.ERROR
                        });
                    } else {
                        if (error.error.data) {
                            this._notificationService.showToast({
                                message: error.error.data,
                                typeToast: TypeToast.ERROR
                            });
                        }
                    }
                }

                return throwError(() => new Error(error));
            })
        );
    }
}

import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarRef } from '@angular/material/snack-bar';

import { NotificationComponent } from '@shared/components';
import { TypeToast } from '@shared/enums';
import { Notification, ValidationResult } from '@shared/models';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private snackBar: MatSnackBar) { }

  showToast(data: Notification): MatSnackBarRef<NotificationComponent> {
    const config: MatSnackBarConfig = {
      panelClass: ['override-shared-componentes-notification-custom-class'],
      data,
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'center'
    };

    return this.snackBar.openFromComponent(NotificationComponent, config);
  }

  showToastPosition(data: Notification, horizontalPos: MatSnackBarHorizontalPosition): MatSnackBarRef<NotificationComponent> {
    const config: MatSnackBarConfig = {
      panelClass: ['override-shared-componentes-notification-custom-class'],
      data,
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: horizontalPos
    };

    return this.snackBar.openFromComponent(NotificationComponent, config);
  }

  showToastError(error: ValidationResult): MatSnackBarRef<NotificationComponent> {
    return this.showToast({
      message: error.errors.length > 0 ? error.errors[0].errorMessage : 'Ocorreu um erro',
      typeToast: TypeToast.ERROR
    });
  }
}

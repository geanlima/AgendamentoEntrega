import { Component, Inject } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { Notification } from '../../models/notification';
import { TypeToast } from '@shared/enums';

@Component({
  selector: 'sgm-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent {
  success = false;

  warning = false;

  error = false;

  constructor(private snackBarRef: MatSnackBarRef<NotificationComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: Notification) {
    this.success = data.typeToast === TypeToast.SUCCESS;
    this.warning = data.typeToast === TypeToast.WARNING;
    this.error = data.typeToast === TypeToast.ERROR;
  }

  dismiss(): void {
    this.snackBarRef.dismiss();
  }
}

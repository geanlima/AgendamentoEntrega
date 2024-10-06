import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { ComponentType } from '@angular/cdk/portal';

export interface DialogParams {
  header: string;
  message?: string;
  txtAct?: string;
  txtCancel?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DialogService extends MatDialog {
  show<TData, TComponent>(
    component: ComponentType<TComponent>,
    data?: TData,
    classes: string[] = [],
    hasBackdrop: boolean = true,
    disableClose: boolean = true,
    height: string = '',
    width: string = '',
  ): MatDialogRef<TComponent> {
    const panelClass = ['main-dialog', ...classes];
    return this.open(component, {
      data,
      panelClass,
      hasBackdrop,
      disableClose,
      height,
      width,
      backdropClass: 'backdrop',
    });
  }

  showProgress<TComponent>(
    component: ComponentType<TComponent>
  ): MatDialogRef<TComponent> {
    const panelClass = ['override-spinner'];
    return this.open(component, {
      panelClass,
      hasBackdrop: true,
      disableClose: true,
      backdropClass: 'backdrop',
    });
  }

  close<TComponent>(dialog: MatDialogRef<TComponent>): void {
    dialog.close();
  }
}

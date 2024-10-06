import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs/internal/Observable';
import { map, tap } from 'rxjs';

import { WindowManagerService } from './window-manager.service';
import { DialogConfirmationComponent } from '../components/dialog/dialog-confirmation.component';

export interface DialogParams {
  header: string;
  message?: string;
  txtAct?: string;
  txtCancel?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DialogConfirmationService {
  constructor(
    private _matDialog: MatDialog,
    private _windowManager: WindowManagerService
  ) { }

  openDialog(diagArgs: DialogParams): Observable<boolean> {

    const dialogRef = this._matDialog.open(
      DialogConfirmationComponent,
      { data: diagArgs }
    );

    this._windowManager.addPopup(dialogRef);

    return dialogRef.afterClosed()
      .pipe(
        map(result => result === true),
        tap(() => this._windowManager.removePopup(dialogRef))
      );
  }
}

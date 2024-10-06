import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Key } from '@shared/enums';
import { DialogParams } from '@shared/services';

@Component({
  selector: 'sgm-dialog-confirmation',
  templateUrl: './dialog-confirmation.component.html',
  styleUrls: ['./dialog-confirmation.component.scss']
})
export class DialogConfirmationComponent {
  public header: string;
  public msg?: string;
  public btnAction?: string;
  public btnCancel?: string;

  constructor(
    dialogRef: MatDialogRef<DialogConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) data: DialogParams
  ) {
    this.header = data.header;
    this.msg = data.message;
    this.btnAction = data.txtAct;
    this.btnCancel = data.txtCancel;

    if (!data.txtAct && !data.txtCancel) this.btnAction = 'Ok';

    dialogRef.keydownEvents()
      .subscribe((e) => {
        if (e.key === Key.Enter) {
          dialogRef.close(true);
        }
      });
  }
}

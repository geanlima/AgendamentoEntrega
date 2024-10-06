import { OverlayRef } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UtilArray } from '@shared/utils';

type PopupsType = OverlayRef | MatDialogRef<unknown>;

@Injectable({
  providedIn: 'root'
})
export class WindowManagerService {
  private popups: PopupsType[] = [];

  checkCurrentPopup(popup: PopupsType): boolean {
    const currentPopup = this.popups[this.popups.length - 1];
    return currentPopup === popup;
  }

  addPopup(popup: PopupsType): void {
    this.popups.push(popup);
  }

  removePopup(popup: PopupsType): void {
    UtilArray.removeItem(this.popups, popup);
  }
}

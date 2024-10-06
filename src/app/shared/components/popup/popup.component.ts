import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PopupComponent {
  @Input() title: string = '';
  @Input() temp!: TemplateRef<any>;
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  onClosePopUp(): void {
    this.closeModal.emit();
  }
}

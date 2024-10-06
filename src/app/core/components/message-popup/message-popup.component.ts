import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-message-popup',
  templateUrl: './message-popup.component.html',
  styleUrls: ['./message-popup.component.scss']
})
export class MessagePopupComponent implements OnInit {

  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  public mensagemForm!: FormGroup;

  public tipoSelecionado: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {

  }

  ngOnInit() {
  }

  onCloseModal(): void {
    this.closeModal.emit();
  }

}

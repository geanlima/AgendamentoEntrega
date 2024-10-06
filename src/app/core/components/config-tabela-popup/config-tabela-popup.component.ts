import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ColunasTabela } from 'src/app/shared/models/colunas-tabela';

@Component({
  selector: 'app-config-tabela-popup',
  templateUrl: './config-tabela-popup.component.html',
  styleUrls: ['./config-tabela-popup.component.scss']
})
export class ConfigTabelaPopupComponent implements OnInit {

  @Output() closeModal: EventEmitter<ColunasTabela[]> = new EventEmitter<ColunasTabela[]>();

  colunastabela: ColunasTabela[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.colunastabela = data.colunas;
  }

  ngOnInit() {
  }

  onSalvar(): void {
    this.closeModal.emit(this.colunastabela);
  }

  onCloseModal(): void {
    this.closeModal.emit([]);
  }

}

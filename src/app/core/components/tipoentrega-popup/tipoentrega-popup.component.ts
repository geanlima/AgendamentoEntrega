import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { TipoEntrega } from 'src/app/shared/models/pedido';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tipoentrega-popup',
  templateUrl: './tipoentrega-popup.component.html',
  styleUrls: ['./tipoentrega-popup.component.scss']
})
export class TipoEntregaPopupComponent {
  @Output() closeModal: EventEmitter<string> = new EventEmitter<string>();

  public tipoentrega$!: Observable<TipoEntrega[]>;
  public entregaselected: string = "";
  public isSelected: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _http: HttpClient,
  )
  { 
    this.tipoentrega$ = this._http.get<TipoEntrega[]>('./../assets/data/tipoentrega.json');
  }

  onCloseModal(): void {
    this.closeModal.emit();
  }

  onEntregaChange(e: any){
    this.entregaselected = e.target.id;
    this.isSelected = true;
  }

  onConfirm(): void {
    if (this.entregaselected != "")
    {
      this.closeModal.emit(this.entregaselected);
    }
  }

}

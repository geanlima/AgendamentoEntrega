import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { StorageService } from '@shared/services';
import { Observable } from 'rxjs';
import { TipoEntrega } from 'src/app/shared/models/pedido';
import { ItenVenda } from 'src/app/shared/models/venda';

@Component({
  selector: 'app-tipo-entrega',
  templateUrl: './tipo-entrega.component.html',
  styleUrls: ['./tipo-entrega.component.scss']
})
export class TipoEntregaComponent {
  @Input() itemVenda: ItenVenda = {} as ItenVenda;

  public tipoentrega$!: Observable<TipoEntrega[]>;
  
  constructor(private _http: HttpClient,
              private storageService: StorageService) {
    this.tipoentrega$ = this._http.get<TipoEntrega[]>('./../assets/data/tipoentrega.json');
  }

}

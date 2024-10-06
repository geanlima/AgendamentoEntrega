import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { PedidoFornecedor } from 'src/app/pages/fornecedor/pedido-fornecedor/pedidofornecedor';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FornecedorService extends BaseService {
  override url: string = 'suppliers';

  constructor(
    httpCliente: HttpClient
  ) {
    super(httpCliente);
  }

  getPedidoFornecedor(fornecedor: string): Observable<PedidoFornecedor[]> {
    this.url = 'suppliers/';
    const params = `${fornecedor}`;
    return this.getMultParams<PedidoFornecedor[]>(params);
  }
}

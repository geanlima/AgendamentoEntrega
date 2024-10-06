import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';

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
}

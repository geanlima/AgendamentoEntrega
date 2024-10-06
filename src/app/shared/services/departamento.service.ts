import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DepartamentoService extends BaseService {
  override url: string = 'departments';

  constructor(
    httpCliente: HttpClient
  ) {
    super(httpCliente);
  }
}

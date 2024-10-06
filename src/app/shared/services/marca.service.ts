import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MarcaService extends BaseService {
  override url: string = 'brands';

  constructor(
    httpCliente: HttpClient
  ) {
    super(httpCliente);
  }
}

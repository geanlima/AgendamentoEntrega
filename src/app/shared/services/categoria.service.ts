import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService extends BaseService {
  override url: string = 'categories';

  constructor(
    httpCliente: HttpClient
  ) {
    super(httpCliente);
  }
}

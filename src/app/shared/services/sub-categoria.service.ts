import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SubCategoriaService extends BaseService {
  override url: string = 'subcategories';

  constructor(
    httpCliente: HttpClient
  ) {
    super(httpCliente);
  }
}

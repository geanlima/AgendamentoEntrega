import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SecaoService extends BaseService {
  override url: string = 'sections';

  constructor(
    httpCliente: HttpClient
  ) {
    super(httpCliente);
  }
}

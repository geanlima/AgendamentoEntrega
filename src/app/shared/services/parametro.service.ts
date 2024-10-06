import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { Parametro } from '../models/parametro';
import { Observable } from 'rxjs';
import { environment } from '@env';

@Injectable({
  providedIn: 'root'
})
export class ParametroService extends BaseService {
  override url: string = 'params/' + environment.unidade;

  constructor(
    httpCliente: HttpClient
  ) {
    super(httpCliente);
  }

  getParametro(unidade: number, name: string): Observable<Parametro> {
    this.url = 'params/' + environment.unidade;
    // const params = `${unidade}?name=${name}`;
    const params = `?name=${name}`;
    return this.getMultParams<Parametro>(params);
  }
}

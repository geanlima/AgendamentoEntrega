import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Venda } from '../models/venda';

@Injectable({
  providedIn: 'root'
})
export class MockService {

  private url = '';

  constructor(private _http: HttpClient) { }

  getAllVendas(): Observable<Venda[]> {
    this.url = './../assets/mockdata/vendas.json';
    return this._http.get<Venda[]>(this.url);
  }
}

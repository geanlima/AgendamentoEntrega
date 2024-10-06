import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  url: string = '';
  private options = { headers: new HttpHeaders().set('Content-Type', 'application/json') };

  constructor(
    private _httpClient: HttpClient
  ) { }

  post<T, TReturn>(objeto: T): Observable<TReturn> {
    return this._httpClient.post<TReturn>(environment.apiUrl + this.url, objeto, this.options);
  }

  put<T, TReturn>(objeto: T): Observable<TReturn> {
    return this._httpClient.put<TReturn>(environment.apiUrl + this.url, objeto, this.options);
  }

  putParams<T, TReturn>(objeto: T, id: number | string): Observable<TReturn> {
    console.log("putParams - environment.apiUrl + this.url + id", environment.apiUrl + this.url + id)
    return this._httpClient.put<TReturn>(environment.apiUrl + this.url + id, objeto, this.options);
  }

  patch<T, TReturn>(objeto: T): Observable<TReturn> {
    return this._httpClient.patch<TReturn>(environment.apiUrl + this.url, objeto, this.options);
  }

  delete<TReturn>(): Observable<TReturn> {
    return this._httpClient.delete<TReturn>(environment.apiUrl + this.url, this.options)
  }

  get<TReturn>(id: number | string): Observable<TReturn> {
    return this._httpClient.get<TReturn>(environment.apiUrl + this.url + id, this.options);
  }

  getBy<TReturn>(url: string): Observable<TReturn> {
    return this._httpClient.get<TReturn>(environment.apiUrl + this.url + url, this.options);
  }

  getAll<TReturn>(): Observable<TReturn> {
    return this._httpClient.get<TReturn>(environment.apiUrl + this.url, this.options);
  }

  getMultParams<TReturn>(params: string): Observable<TReturn> {
    return this._httpClient.get<TReturn>(environment.apiUrl + this.url + params, this.options);
  }

  async getByAsync<TReturn>(url: string): Promise<TReturn | undefined> {
    return await this._httpClient.get<TReturn>(environment.apiUrl + this.url + url, this.options).toPromise();
  }
}

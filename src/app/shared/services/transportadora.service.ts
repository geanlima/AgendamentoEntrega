import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { Transportadora } from '../models/transportadora';

@Injectable({
  providedIn: 'root'
})
export class TransportadoraService extends BaseService{
  override url: string = '';
  
  
  getAllTransportadora(): Observable<Transportadora[]> {
    this.url = 'transportadora/all';
    return this.getAll<Transportadora[]>();
  }
}

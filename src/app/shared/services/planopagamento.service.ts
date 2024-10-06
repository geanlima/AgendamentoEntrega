import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PlanoPagamento } from '../models/venda';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class PlanoPagamentoService extends BaseService {

  getPlanoPagamento(clientCode: number, rcaCode: number): Observable<PlanoPagamento[]> {
    this.url = 'payment-plans?'
    const params = `clientCode=${clientCode}&rcaCode=${rcaCode}`;
    return this.getMultParams<PlanoPagamento[]>(params);
  }

  getAllPlanoPagamento(): Observable<PlanoPagamento[]> {
    this.url = 'payment-plans/list'
    return this.getAll<PlanoPagamento[]>();
  }

}

import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Agendamento } from 'src/app/pages/agendamento/models/agendamento';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AgendamentoService extends BaseService{

  saveAgendamento(agendamento: Agendamento): Observable<any> {    
    this.url = 'schedule';
    return this.post(agendamento);
  }

  getAgendamento(fornecedor: string): Observable<Agendamento[]> {
    this.url = 'schedule/';    
    const params = `${fornecedor}`;
    return this.getMultParams<Agendamento[]>(params);
  }

  getAllAgendamento(): Observable<Agendamento[]> {
    this.url = 'schedule/resume';
    return this.getAll<Agendamento[]>();
  }
}

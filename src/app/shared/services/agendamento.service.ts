import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Agendamento } from 'src/app/pages/agendamento/models/agendamento';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgendamentoService extends BaseService{

  saveVenda(agendamento: Agendamento): Observable<Agendamento> {
    this.url = '';
    return this.post(agendamento);
  }
}

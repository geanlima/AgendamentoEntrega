import { Injectable } from '@angular/core';
import { Observable, map, take } from 'rxjs';
import { Cliente, ClienteCompleto, HistoricoCobranca, SACCliente } from '../models/cliente';
import { BaseService } from './base.service';
import { Endereco } from '../models/venda';
import { PainelAtendimento } from '../models/painel-atendimento';

@Injectable({
  providedIn: 'root'
})

export class ClienteService extends BaseService {

  getClienteById(id: number): Observable<ClienteCompleto> {
    this.url = 'clients/';
    return this.get<ClienteCompleto>(id);
  }

  getAllClientes(): Observable<Cliente[]> {
    this.url = 'clients/resume';
    return this.getAll<Cliente[]>();
  }

  getAllClientesFull(): Observable<ClienteCompleto[]> {
    this.url = 'clients/clientesfull';
    return this.getAll<ClienteCompleto[]>();
  }

  getAllEndereco(id: number): Observable<Endereco[]> {
    this.url = `clients/${id}/address`;
    return this.getAll<Endereco[]>();
  }

  getPainelAtendimento(id: number, unidade: number): Observable<PainelAtendimento[]> {
    this.url = `clients/${id}/atendimento?codigoUnidade=${unidade}`;
    return this.getAll<PainelAtendimento[]>();
  }

  getClienteGeral(cnpjCpf: string): Observable<Cliente[]> {
    this.url = `clients/geral?cnpj=${cnpjCpf}`;
    return this.getAll<Cliente[]>();
  }

  getAllSAC(id: number): Observable<SACCliente[]> {
    this.url = `clients/sac/${id}`;
    return this.getAll<SACCliente[]>();
  }

  getAllHistoricoCobranca(id: number): Observable<HistoricoCobranca[]> {
    this.url = `clients/historicocobranca/${id}`;
    return this.getAll<HistoricoCobranca[]>();
  }

}

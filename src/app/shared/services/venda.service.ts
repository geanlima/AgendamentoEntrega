import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Filial, IntegracaoPedido, TipoCobranca, TipoVendaUsuario, Venda, VendaCompleta, VendaInseridaNovo } from '../models/venda';
import { Observable } from 'rxjs';
import { environment } from '@env';

@Injectable({
  providedIn: 'root'
})
export class VendaService extends BaseService {

  integraVenda(codpedido: number): Observable<any> {
    const request: IntegracaoPedido = { CodigoPedido: codpedido };
    this.url = 'sales/IntegracaoVenda';
    return this.post(request);
  }

  saveVenda(venda: VendaCompleta): Observable<VendaInseridaNovo> {
    this.url = 'sales';
    return this.post(venda);
  }

  updateVenda(venda: VendaCompleta): Observable<VendaInseridaNovo> {
    this.url = `Sales/`;
    return this.putParams<VendaCompleta, VendaInseridaNovo>(venda, venda.codigo_pedido_rca.toString());
  }

  getAllVendas(): Observable<Venda[]> {
    this.url = 'sales';
    return this.getAll<Venda[]>();
  }

  getVendaById(id: number | string): Observable<VendaCompleta> {
    this.url = 'Sales/salesByVendaid/';
    return this.get<VendaCompleta>(id);
  }

  getTipoVenda(clientCode: number): Observable<TipoVendaUsuario[]> {
    this.url = 'salestype?';
    const params = `clientCode=${clientCode}`;
    return this.getMultParams<TipoVendaUsuario[]>(params);
  }

  getTipoCobrancaByClienteRCA(clientCode: number, rcaCode: number): Observable<TipoCobranca[]> {
    this.url = 'charge?';
    const params = `clientCode=${clientCode}&rcaCode=${rcaCode}`;

    
    return this.getMultParams<TipoCobranca[]>(params);
  }

  getAllFiliais(): Observable<Filial[]> {
    this.url = 'unit';
    return this.getAll<Filial[]>();
  }

  processarVenda(vendaInserida: VendaInseridaNovo): Observable<unknown> {
    throw new Error('Method not implemented.');
  }
}

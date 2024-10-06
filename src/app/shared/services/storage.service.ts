import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario';
import { VendaCompleta } from '../models/venda';
import { ClienteCompleto, Parametro } from '@shared/models';
import { PainelAtendimento } from '../models/painel-atendimento';
import { PedidoFornecedor } from 'src/app/pages/fornecedor/pedido-fornecedor/pedidofornecedor';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  static readonly TOKEN_STORAGE = 'authToken';

  saveSearchFilter(pageName: string, searchTerm: string): void {
    sessionStorage.setItem(pageName,
      JSON.stringify({
        'filtro': searchTerm ?
          searchTerm.trim().toLocaleLowerCase() :
          null
      })
    );
  }

  getSearchFilter(pageName: string): string {
    const storageDictionary = sessionStorage.getItem(pageName);

    if (!storageDictionary) return '';

    const searchTerm = JSON.parse(storageDictionary).filtro;

    return searchTerm ? searchTerm : null;
  }

  saveToken(token: string): void {
    sessionStorage.setItem(StorageService.TOKEN_STORAGE, token);
  }

  getToken(): string {
    const token = sessionStorage.getItem(StorageService.TOKEN_STORAGE);

    return token ? token : '';
  }

  removeToken(): void {
    sessionStorage.removeItem(StorageService.TOKEN_STORAGE);
  }

  saveUsuario(usuario: Usuario): void {
    sessionStorage.setItem('user',
      JSON.stringify(usuario)
    );
  }

  getUsuario(): Usuario {
    const storageDictionary = sessionStorage.getItem('user');

    if (!storageDictionary) return {} as Usuario;

    return JSON.parse(storageDictionary) as Usuario;
  }

  saveVendaCompleta(vendaCompleta: VendaCompleta): void {
    sessionStorage.setItem('sales_full',
      JSON.stringify(vendaCompleta)
    );
  }

  getVendaCompleta(): VendaCompleta {
    const storageDictionary = sessionStorage.getItem('sales_full');

    if (!storageDictionary) return {} as VendaCompleta;

    return JSON.parse(storageDictionary) as VendaCompleta;
  }

  removeVendaCompleta(): void {
    sessionStorage.removeItem('sales_full');
  }

  saveVendaCompletaTipoEntrega(tipo: string): void {
    sessionStorage.setItem('tipoentrega', tipo);
  }

  getVendaCompletaTipoEntrega(): string {
    const storageDictionary = sessionStorage.getItem('tipoentrega');
    return storageDictionary == null ? "": storageDictionary.toString();
  }

  saveParametros(parms: Parametro[]): void {
    sessionStorage.setItem('params',
      JSON.stringify(parms)
    );
  }

  getParametros(): Parametro[] {
    const storageDictionary = sessionStorage.getItem('params');

    if (!storageDictionary) return {} as Parametro[];

    return JSON.parse(storageDictionary) as Parametro[];
  }

  removeClienteCompleto(): void {
    sessionStorage.removeItem('client_full');
  }

  saveClienteCompleto(clienteCompleto: ClienteCompleto) {
    sessionStorage.setItem('client_full',
      JSON.stringify(clienteCompleto)
    );
  }

  getClienteCompleto(): ClienteCompleto {
    const storageDictionary = sessionStorage.getItem('client_full');

    if (!storageDictionary) return {} as ClienteCompleto;

    return JSON.parse(storageDictionary) as ClienteCompleto;
  }

  savePainelAtendimento(painelAtendimento: PainelAtendimento) {
    sessionStorage.setItem('attention_panel',
      JSON.stringify(painelAtendimento)
    );
  }

  getPainelAtendimento(): PainelAtendimento {
    const storageDictionary = sessionStorage.getItem('attention_panel');

    if (!storageDictionary) return {} as PainelAtendimento;

    return JSON.parse(storageDictionary) as PainelAtendimento;
  }

  savePedidoFornecedor(pedidoFornecedor: PedidoFornecedor) {
    sessionStorage.setItem('attention_panel',
      JSON.stringify(pedidoFornecedor)
    );
  }
}

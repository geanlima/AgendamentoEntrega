import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { Oferta, Produto, ProdutoDetalhe, Validade } from '@shared/models';
import { Observable } from 'rxjs';
import { environment } from '@env';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService extends BaseService {
  override url: string = 'products';

  constructor(
    httpCliente: HttpClient
  ) {
    super(httpCliente);
  }

  getValidade(
    codigoProduto: number,
    codigoUnidade: string
  ): Observable<Validade[]> {
    if (!codigoUnidade) codigoUnidade = environment.unidade;
    return this.getBy(
      `/validate?unitCode=${codigoUnidade}&productCode=${codigoProduto}`
    );
  }

  async getValidadeItem(
    codigoCampanha: string,
    codigoProduto: number,
    codigoUnidade: string
  ): Promise<Validade | undefined> {
    const resultado = await this.getByAsync(
      `/validate/${codigoCampanha}?unitCode=${codigoUnidade}&productCode=${codigoProduto}`
    ) as Validade;

    return resultado;
  }

  getOfertas(
    codigoUnidade: number,
    codigoProduto: number,
    codigoCliente: number,
    codigoRegiao: number,
    ufCliente: number,
    codigoAtividade: number,
    codigoRede: number,
    codigoRCA: number,
    codigoSupervisor: number,
    codigoPlanoPagamento: number,
  ): Observable<Oferta[]> {
    return this.getBy(
      `/offers?codigoUnidade=${codigoUnidade}&codigoProduto=${codigoProduto}&codigoCliente=${codigoCliente}&codigoRegiao=${codigoRegiao}&ufCliente=${ufCliente}&codigoAtividade=${codigoAtividade}&codigoRede=${codigoRede}&codigoRCA=${codigoRCA}&codigoSupervisor=${codigoSupervisor}&codigoPlanoPagamento=${codigoPlanoPagamento}`
    )
  }

  getProdutos(
    codigoUnidade: string,
    codigoCliente: number,
    acrescimoDesconto: number,
    codigoRegiao: number,
    codigoDepartamento?: number,
    codigoSecao?: number,
    codigoCategoria?: number,
    codigoSubCategoria?: number,
    codigoMarca?: number,
    codigoFornecedor?: number,
    estoque?: number,
    mixCliente?: number
  ): Observable<Produto[]> {
    const defaultRoute = `/resume?codigoUnidade=${codigoUnidade}&codigoCliente=${codigoCliente}&acrescimoDesconto=${acrescimoDesconto}&codigoRegiao=${codigoRegiao}`;

    if (codigoDepartamento) {
      defaultRoute.concat(`codigoDepartamento=${codigoDepartamento}`);
    } if (codigoSecao) {
      defaultRoute.concat(`codigoSecao=${codigoSecao}`);
    } if (codigoCategoria) {
      defaultRoute.concat(`codigoCategoria=${codigoCategoria}`);
    } if (codigoSubCategoria) {
      defaultRoute.concat(`codigoSubCategoria=${codigoSubCategoria}`);
    } if (codigoDepartamento) {
      defaultRoute.concat(`codigoDepartamento=${codigoDepartamento}`);
    } if (codigoMarca) {
      defaultRoute.concat(`codigoMarca=${codigoMarca}`);
    } if (codigoFornecedor) {
      defaultRoute.concat(`codigoFornecedor=${codigoFornecedor}`);
    } if (estoque) {
      defaultRoute.concat(`estoque=${estoque}`);
    } if (mixCliente) {
      defaultRoute.concat(`mixCliente=${mixCliente}`);
    }

    return this.getBy(
      defaultRoute
    )
  }

  getProdutoCompleto(
    codigoCliente: number,
    codigoRegiao: number,
    uf: string,
    codigoAtividade: number,
    codigoRede: number,
    codigoRCA: number,
    codigoSupervisor: number,
    codigoPlanoPagamento: number,
    codigoProduto: number,
    codigoUnidade: string
  ): Observable<any> {
      return this.getBy(
        `?codigoCliente=${codigoCliente}&codigoRegiao=${codigoRegiao}&uf=${uf}&codigoAtividade=${codigoAtividade}&codigoRede=${codigoRede}&codigoRCA=${codigoRCA}&codigoSupervisor=${codigoSupervisor}&codigoPlanoPagamento=${codigoPlanoPagamento}&codigoProduto=${codigoProduto}&codigoUnidade=${codigoUnidade}`
      )
  }

  getProdutoConsulta(
    codigoUnidade: string,
    codigoCliente: number,
    codigoRegiao: number,
    acrescimoDescontoMaximo: number,
  ): Observable<ProdutoDetalhe[]> {
    return this.getBy(
      `?codigoUnidade=${codigoUnidade}&codigoCliente=${codigoCliente}&codigoRegiao=${codigoRegiao}&acrescimoDescontoMaximo=${acrescimoDescontoMaximo}`
    )
  }

}

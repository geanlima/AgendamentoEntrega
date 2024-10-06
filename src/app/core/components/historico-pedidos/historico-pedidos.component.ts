import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DialogService } from '@shared/services';
import { HistoricoPedidos } from 'src/app/shared/models/historico-pedidos';
import { PainelAtendimento } from 'src/app/shared/models/painel-atendimento';
import { ItemHistoricoPopupComponent } from '../item-historico-popup/item-historico-popup.component';

@Component({
  selector: 'app-historico-pedidos',
  templateUrl: './historico-pedidos.component.html',
  styleUrls: ['./historico-pedidos.component.scss']
})
export class HistoricoPedidosComponent implements AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public historicopedidos: HistoricoPedidos[] = [];
  public filterDataEmissaoInicio: string = '';
  public filterDataEmissaoFinal: string = '';
  public filterNumeroPedido: string = '';
  public filterSituacao: string = '';

  public searchTerm: string = '';
  public displayedColumns = ['dataPedido', 'numeroPedido', 'valorTotal', 'quantidadeitens', 'situacao', 'action'];
  public dataSource!: MatTableDataSource<HistoricoPedidos>;
  public page: number = 0;
  public pageSize: number = 8;

  situacoes: string[] = ['Liberado', 'Em Carregamento', 'Bloqueado', 'Faturado'];

  private painelatendimento: PainelAtendimento | undefined;

  private readonly VIEW_CODE: string = 'POPUP_HISTORICO';

  constructor(
    private _dialog: DialogService,
  ) {
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.onSearchChanged();
    });
  }

  getIconSituacao(situacao: string): string {
    switch (situacao) {
      case 'Liberado':
        return 'done';
      case 'Em Carregamento':
        return 'local_shipping';
      case 'Bloqueado':
        return 'lock';
      case 'Faturado':
        return 'article';
      case 'Cancelado':
        return 'delete';
      default:
        return 'do_not_disturb';
    }
  }

  onSearchChanged(): void {
    let filteredData = this.historicopedidos;

    if (this.filterDataEmissaoInicio) {

      const dataEmissaoInicial = new Date(this.filterDataEmissaoInicio);

      filteredData = filteredData.filter(t => new Date(t.dataPedido) >= dataEmissaoInicial);
    }

    if (this.filterDataEmissaoFinal) {

      const dataEmissaoFinal = new Date(this.filterDataEmissaoFinal);

      filteredData = filteredData.filter(t => new Date(t.dataPedido) <= dataEmissaoFinal);
    }

    if (this.filterNumeroPedido) {
      filteredData = filteredData.filter(t => t.numeroPedido.toString().includes(this.filterNumeroPedido));
    }

    if (this.filterSituacao) {
      filteredData = filteredData.filter(t => t.situacao.toLocaleLowerCase().trim() === this.filterSituacao.toLocaleLowerCase().trim());
    }

    this.setDataSource(filteredData);

  }

  onVerItens(numeropedido: number): void {
    const pedidoIten = this.historicopedidos.find(p => p.numeroPedido === numeropedido);

    const itemPopup = this._dialog.show(ItemHistoricoPopupComponent,
      {
        pedido: pedidoIten,
        painelatendimento: this.painelatendimento
      },
      ['override-modal-titulos'],
      true,
      true,
      '650px',
      '1200px',
    );

    itemPopup.componentInstance.closeModal.subscribe(() => {
      this._dialog.close(itemPopup);
    });
  }

  onVerNotas(numeropedido: number): void {
    //
  }

  setPainelAtendimentoHistorico(painelatendimento: PainelAtendimento) {
    this.painelatendimento = painelatendimento;
    this.historicopedidos = this.painelatendimento.pedidos;
    this.setDataSource(this.historicopedidos);
  }

  private setDataSource(historicopedidos: HistoricoPedidos[]) {
    this.dataSource = new MatTableDataSource(historicopedidos);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
}
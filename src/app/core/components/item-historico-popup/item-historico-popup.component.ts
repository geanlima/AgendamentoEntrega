import { DecimalPipe } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Inject, OnDestroy, Output, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { HistoricoPedidos } from 'src/app/shared/models/historico-pedidos';
import { ItemHistorico } from 'src/app/shared/models/item-historico';
import { PainelAtendimento } from 'src/app/shared/models/painel-atendimento';

@Component({
  selector: 'app-item-historico-popup',
  templateUrl: './item-historico-popup.component.html',
  styleUrls: ['./item-historico-popup.component.scss']
})
export class ItemHistoricoPopupComponent implements AfterViewInit, OnDestroy {
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public page: number = 0;
  public pageSize: number = 5;
  public searchTerm: string = '';
  public dataSource!: MatTableDataSource<ItemHistorico>;
  public displayedColumns = ['codigoProduto', 'descricao', 'preco', 'unidade', 'embalagem', 'total'];

  public pesoBruto!: string | null;


  private _subs: Subscription[] = [];

  private itenshistorico: ItemHistorico[] = [];
  public historicoPedido: HistoricoPedidos | undefined;
  public painelatendimento: PainelAtendimento | undefined;
  public qtditens: number = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _decimalPipe: DecimalPipe,
  ) {
    if (data.pedido) {
      this.historicoPedido = data.pedido;
      if (this.historicoPedido?.itens) {
        this.itenshistorico = this.historicoPedido.itens;

        this.qtditens = this.itenshistorico.reduce((total, item) => total + item.quantidade, 0);
      }

      let pesoBrutoNumber = 0;

      if (this.historicoPedido?.pesoBruto) {
        pesoBrutoNumber = this.historicoPedido?.pesoBruto;
      }

      this.pesoBruto = this._decimalPipe.transform(pesoBrutoNumber, '1.2-2');
    }

    if (data.painelatendimento) {
      this.painelatendimento = data.painelatendimento;
    }

  }


  ngAfterViewInit() {
    setTimeout(() => {
      this.setDataSource(this.itenshistorico);
    });

  }

  ngOnDestroy(): void {
    this._subs.forEach((sub: Subscription) => sub.unsubscribe());
  }

  onCloseModal(): void {
    this.closeModal.emit();
  }

  private setDataSource(itenshistorico: ItemHistorico[]) {
    this.dataSource = new MatTableDataSource(itenshistorico);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

}

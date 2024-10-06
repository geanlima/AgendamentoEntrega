import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DadoComerciais, Produto, Validade } from '@shared/models';
import { ProdutoService } from '@shared/services';
import { ItenVenda, VendaCompleta } from 'src/app/shared/models/venda';

@Component({
  selector: 'app-validade-popup',
  templateUrl: './validade-popup.component.html',
  styleUrls: ['./validade-popup.component.scss']
})
export class ValidadePopupComponent implements AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  // @Input() nomeProduto: string = '';
  // @Input() codigoProduto: number = 0;
  // @Input() codigoUnidade: string = '';
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  public page: number = 0;
  public pageSize: number = 6;
  public dataSource!: MatTableDataSource<Validade>;
  public displayedColumns = ['selected', 'data_validade', 'dias_validade', 'estoque', 'preco_promocional', 'action'];

  public produto: Produto;
  public venda: VendaCompleta;
  public itemVenda: ItenVenda;
  public permiteSelecao: boolean = true;

  constructor(
    private produtoService: ProdutoService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    this.produto = data.produto;
    this.venda = data.venda;
    this.itemVenda = data.itemVenda;
    this.permiteSelecao = data.permiteSelecao;

    this.produtoService.getValidade(
      this.produto.codigo_produto,
      this.venda.codigo_unidade_pedido,
    ).subscribe((validade) => {

      if (validade && validade.length > 0) {
        validade.forEach(ite => {
          if (!ite.codigo_campanha_shelf || ite.codigo_campanha_shelf == '') {

            let dadosComerciais = {} as DadoComerciais;
            if (this.isJson(this.produto?.dados_comerciais)) {
              dadosComerciais = this.produto?.dados_comerciais as DadoComerciais;
            } else {
              dadosComerciais = JSON.parse(this.produto?.dados_comerciais + "") as DadoComerciais ?? {} as DadoComerciais;
            }

            ite.preco_promocional = dadosComerciais.precoTabela;
          }
        });
      }

      this.dataSource = new MatTableDataSource(validade);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

    });
  }

  isJson(obj: any): boolean {
    return obj !== undefined && obj !== null && obj.constructor == Object;
  }

  ngAfterViewInit(): void {
  }

  onCloseModal(): void {
    this.closeModal.emit();
  }

  onSelecionaValidade(validade: Validade) {
    this.itemVenda.codigo_campanha_shelf = validade.codigo_campanha_shelf;
    this.itemVenda.data_validade_campanha_shelf = validade.data_validade;
    this.itemVenda.preco_campanha_shelf = validade.preco_promocional;

    this.itemVenda.percentual_desconto = 0;
    this.itemVenda.preco_venda = validade.preco_promocional;
    this.itemVenda.preco_venda_desconto = validade.preco_promocional;
    this.recalculaTotalItem();
  }

  recalculaTotalItem() {
    this.itemVenda.valor_total = this.itemVenda.preco_venda * this.itemVenda.quantidade;
  }
}

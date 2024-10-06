import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DadoComerciais, ProdutoDetalhe } from '@shared/models';
import { ItenVenda } from 'src/app/shared/models/venda';

@Component({
  selector: 'app-validade',
  templateUrl: './validade.component.html',
  styleUrls: ['./validade.component.scss']
})
export class ValidadeComponent {
  @Input() produto: ProdutoDetalhe | null = {} as ProdutoDetalhe;
  @Input() itemVenda: ItenVenda = {} as ItenVenda;
  @Output() openModalValidade: EventEmitter<void> = new EventEmitter<void>();

  constructor() { }

  onOpenModalValidade(): void {
    this.openModalValidade.emit();
  }

  excluirValidadeShelf(): void {
    this.itemVenda.data_validade_campanha_shelf = undefined;
    this.itemVenda.codigo_campanha_shelf = '';
    this.itemVenda.preco_campanha_shelf = 0;

    const dadoComercial = JSON.parse(this.produto?.dados_comerciais + "") as DadoComerciais ?? {} as DadoComerciais;
    this.itemVenda.percentual_desconto = 0;
    this.itemVenda.preco_venda = dadoComercial.precoTabela;
    this.itemVenda.preco_venda_desconto = dadoComercial.precoTabela;
    this.recalculaTotalItem();
  }

  recalculaTotalItem() {
    this.itemVenda.valor_total = this.itemVenda.preco_venda * this.itemVenda.quantidade;
  }
}

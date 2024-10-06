import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TypeToast } from '@shared/enums';
import { DadoComerciais, ProdutoDetalhe } from '@shared/models';
import { DialogService, NotificationService, ProdutoService, StorageService } from '@shared/services';
import { ItenVenda, VendaCompleta } from 'src/app/shared/models/venda';

@Component({
  selector: 'app-inclusao-produto',
  templateUrl: './inclusao-produto.component.html',
  styleUrls: ['./inclusao-produto.component.scss']
})
export class InclusaoProdutoComponent implements OnInit {
  @Input() produto: any | null = {} as ProdutoDetalhe[];
  @Input() itemVenda: ItenVenda = {} as ItenVenda;
  @Input() closeModal: EventEmitter<void> = new EventEmitter<void>();
  @Output() openModalOfertas: EventEmitter<void> = new EventEmitter<void>();
  dadoComercial: DadoComerciais = {} as DadoComerciais;

  public vendaCompleta: VendaCompleta = {} as VendaCompleta;

  constructor(
    private _storageService: StorageService,
    private _notificationService: NotificationService,
    private _dialogService: DialogService,
    private _productService: ProdutoService
  ) { }

  ngOnInit(): void {
    if (this.produto) {
      this.dadoComercial = this.produto.dados_comerciais;
    }
  }

  onOpenModalOfertas(): void {
    this.openModalOfertas.emit();
  }

  async addItem(): Promise<void> {
    
    this.vendaCompleta = this._storageService.getVendaCompleta();

    //if (await this.validaItemVenda()) {
      this.salvaItemVenda(this.itemVenda);

      this.closeModal.emit();

      this._notificationService.showToast({
        message: "Item adicionado com sucesso",
        typeToast: TypeToast.SUCCESS
      });
    //}

  }

  salvaItemVenda(itemVenda: ItenVenda) {
    
    itemVenda.codigo_pedido_rca = this.vendaCompleta.codigo_pedido_rca;
    const itemIndex = this.vendaCompleta.itens.findIndex(item => item.codigo_produto === itemVenda.codigo_produto);
    if (itemIndex < 0) {
      this.vendaCompleta.itens.push(this.itemVenda);
    } else {
      this.vendaCompleta.itens[itemIndex] = itemVenda;
    }

    this.recalculaValoresVenda(this.vendaCompleta);
    this._storageService.saveVendaCompleta(this.vendaCompleta);
  }

  recalculaValoresVenda(vendaCompleta: VendaCompleta) {
    vendaCompleta.total_itens_pedido = 0;
    vendaCompleta.total_pedido = 0;
    vendaCompleta.total_pedido_com_imposto = 0;

    if (vendaCompleta.itens && vendaCompleta.itens.length > 0) {
      vendaCompleta.itens.forEach(item => {
        item.valor_total = item.preco_venda * item.quantidade;
        item.valor_total_com_imposto = item.preco_venda * item.quantidade;
        item.valor_total_com_st = item.preco_venda * item.quantidade;
      });

      vendaCompleta.total_itens_pedido = vendaCompleta.itens.reduce((total, item) => {
        return total + item.valor_total;
      }, 0);

      vendaCompleta.total_pedido = vendaCompleta.total_itens_pedido;
      vendaCompleta.total_pedido_com_imposto = vendaCompleta.total_itens_pedido;
    }
  }


  private ehMultiplo(dividendo: number, divisor: number): boolean {
    const tolerance = 1e-9;
    const remainder = Math.abs(dividendo % divisor);
    return remainder < tolerance;
  }

  async validaItemVenda(): Promise<boolean> {



    //Quantidade
    if (!this.itemVenda.quantidade) {
      this.showErroNotification('Informe a quantidade para salvar o item');
      return false;
    }

    if (this.itemVenda.quantidade <= 0) {
      this.showErroNotification('Quantidade inválida');
      return false;
    }

    if (Number((this.itemVenda.quantidade)) !== Number((this.produto?.multiplo_produto))) {
      if (this.produto?.multiplo_produto != undefined &&
        //(Number((this.itemVenda.quantidade)) % Number((this.produto?.multiplo_produto))) !== 0) 
        !this.ehMultiplo(this.itemVenda.quantidade, this.produto?.multiplo_produto)) {
        this.showErroNotification('Quantidade deve ser múltipla de ' + this.produto?.multiplo_produto);
        return false;
      }
    }

    if (this.itemVenda.codigo_campanha_shelf && this.itemVenda.codigo_campanha_shelf != '' && this.itemVenda.codigo_produto != undefined) {
      let campanhaShelf = await this._productService.getValidadeItem(this.itemVenda.codigo_campanha_shelf, this.itemVenda.codigo_produto, this.vendaCompleta.codigo_unidade_pedido);
      if (!campanhaShelf) {
        this.showErroNotification('Validade selecionada não disponível');
        return false;
      }

      if (this.itemVenda.quantidade > campanhaShelf.estoque) {
        this.showErroNotification('Quantidade não pode ser maior do que o estoque da validade selecionada');
        return false;
      }
    } else {

      if (!this.produto?.estoque_disponivel) {
        this.showErroNotification('Quantidade maior do que o estoque disponível');
        return false;
      }

      if (this.itemVenda.quantidade > this.produto?.estoque_disponivel) {
        this.showErroNotification('Quantidade maior do que o estoque disponível');
        return false;
      }
    }

    // Desconto/Acréscimo
    if (this.itemVenda.percentual_desconto == undefined) {
      this.showErroNotification('Desconto/Acréscimo informado é inválido');
      return false;
    }

    if (this.itemVenda.percentual_desconto > 0) {
      if (this.itemVenda.percentual_desconto != 0 && this.itemVenda.percentual_desconto > this.dadoComercial.percentualDescontoFlexivel ||
        (this.itemVenda.codigo_campanha_shelf && this.itemVenda.codigo_campanha_shelf != '' && this.itemVenda.codigo_produto != undefined)) {
        this.showErroNotification('Desconto é maior do que o permitido para o item');
        return false;
      }
    } else {
      if (this.itemVenda.codigo_campanha_shelf && this.itemVenda.codigo_campanha_shelf != '' && this.itemVenda.codigo_produto != undefined) {
      } else {
        if (this.itemVenda.percentual_desconto != 0 && this.itemVenda.percentual_desconto < this.dadoComercial.percentualAcrescimoMaximo) {
          this.showErroNotification('Acréscimo é maior do que o permitido para o item');
          return false;
        }
      }
    }

    //Preço
    if (this.itemVenda.preco_venda == undefined) {
      this.showErroNotification('Preço de venda informado é inválido');
      return false;
    }

    if (this.itemVenda.codigo_campanha_shelf && this.itemVenda.codigo_campanha_shelf != '' && this.itemVenda.codigo_produto != undefined) {
      if (this.itemVenda.preco_venda > this.dadoComercial.precoTabela) {
        this.showErroNotification('Preço maior do que o permitido para o item');
        return false;
      }
    } else {
      if (this.itemVenda.preco_venda > this.dadoComercial.precoMaximo) {
        this.showErroNotification('Preço maior do que o permitido para o item');
        return false;
      }
    }

    if (!this.itemVenda.codigo_campanha_shelf || this.itemVenda.codigo_campanha_shelf == '') {
      if (this.itemVenda.preco_venda < this.dadoComercial.precoMinimo) {
        this.showErroNotification('Preço menor do que o permitido para o item');
        return false;
      }
    }


    return true;
  }

  isDivisible(quantidade: number, multiplo: number): boolean {
    if (!multiplo || multiplo === 0) {
      return false;
    }

    const quotient = quantidade / multiplo;

    const quotientStr = quotient.toString();
    const decimalIndex = quotientStr.indexOf(".");

    if (decimalIndex !== -1) {
      const decimalPart = quotientStr.substring(decimalIndex + 1);
      return decimalPart.length === 0;
    }

    return true;
  }

  showErroNotification(texto: string): void {
    this._notificationService.showToast({
      message: texto,
      typeToast: TypeToast.SUCCESS
    });
  }

  // retornaItemVenda(): ItenVenda {
  //   return {
  //     codigo_pedido_rca: 0,
  //     codigo_rca: 0,
  //     data_hora_abertura_pedido: undefined,
  //     item: 0,
  //     codigo_produto: '', //AQUI
  //     descricao_produto: '', //AQUI
  //     quantidade: 0, //AQUI
  //     preco_venda_original: 0,
  //     preco_venda: 0, //AQUI
  //     codigo_barras: '',
  //     quantidade_faturada: 0,
  //     bonificacao: '',
  //     codigo_combo: 0,
  //     corte: '',
  //     percentual_desconto: 0,
  //     percnetual_desconto_boleto: 0,
  //     sugestao: '',
  //     codigo_pedido: 0,
  //     preco_venda_desconto: 0,
  //     valor_total: 0, //AQUI
  //     valor_total_com_imposto: 0,
  //     codigo_desconto3306: '',
  //     descricao_desconto3306: '',
  //     codigo_produto_principal: '',
  //     observacao_retorno: '',
  //     codigo_unidade_retirada: '',
  //     tipo_entrega: '',
  //     codigo_desconto561: '',
  //     diferenca_preco: 0,
  //     saldo_verba: 0,
  //     base_cred_deb_rca_descont561: '',
  //     aplica_automatico_desconto561: '',
  //     percentual_desconto561: 0,
  //     codigo_auxiliar_embalagem: '',
  //     quantidade_unitaria_embalagem: 0,
  //     utiliza_venda_por_embalagem: '',
  //     tipo_carga_produto: '',
  //     exibe_combo_embalagem: '',
  //     item_negociado: '',
  //     unidade_venda: '', //AQUI
  //     tipo_estoque_produto: '',
  //     codigo_regiao: 0,
  //     percentual_acrescimo: 0,
  //     comissao: 0,
  //     peso: 0,
  //     valor_st: 0,
  //     preco_st: 0,
  //     valor_total_com_st: 0,
  //     numero_carregamento: 0,
  //     percentual_base_red: 0,
  //     percentual_icm: 0,
  //     data_validade_campanha_shelf: undefined,
  //     preco_campanha_shelf: 0,
  //     codigo_campanha_shelf: '',
  //     unidade_frios: '',
  //   };
  // }

  addQuantidade(): void {
    let multiplo = this.produto?.multiplo_produto;
    if (!multiplo || multiplo <= 0) multiplo = 1;
    this.itemVenda.quantidade += multiplo;
    this.itemVenda.quantidade = parseFloat(this.itemVenda.quantidade.toFixed(3));
    this.recalculaTotalItem();
  }

  removeQuantidade(): void {
    let multiplo = this.produto?.multiplo_produto;
    if (!multiplo || multiplo <= 0) multiplo = 1;
    this.itemVenda.quantidade -= multiplo;
    if (this.itemVenda.quantidade <= 0) this.itemVenda.quantidade = multiplo;
    this.itemVenda.quantidade = parseFloat(this.itemVenda.quantidade.toFixed(3));
    this.recalculaTotalItem();
  }

  recalculaTotalItem() {
    this.itemVenda.valor_total = this.itemVenda.preco_venda * this.itemVenda.quantidade;
  }

  calculaPrecoVenda() {
    let precoTabela = this.dadoComercial.precoTabela;
    if (this.itemVenda.codigo_campanha_shelf && this.itemVenda.codigo_campanha_shelf != '') precoTabela = this.itemVenda.preco_campanha_shelf;
    let precoVenda = precoTabela - ((this.itemVenda.percentual_desconto / 100) * precoTabela);
    this.itemVenda.preco_venda = parseFloat(precoVenda.toFixed(2));
    this.itemVenda.preco_venda_desconto = this.itemVenda.preco_venda;
  }

  calculaDescontoAcrescimo() {
    let precoTabela = this.dadoComercial.precoTabela;
    if (this.itemVenda.codigo_campanha_shelf && this.itemVenda.codigo_campanha_shelf != '') precoTabela = this.itemVenda.preco_campanha_shelf;
    const descontoAcrescimoPercentual = ((precoTabela - this.itemVenda.preco_venda) * 100) / precoTabela;
    this.itemVenda.percentual_desconto = parseFloat(descontoAcrescimoPercentual.toFixed(2));
    this.itemVenda.preco_venda_desconto = this.itemVenda.preco_venda;
  }
}

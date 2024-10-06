import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogService, ProdutoService, StorageService } from '@shared/services';
import { ValidadePopupComponent } from '../validade-popup/validade-popup.component';
import { OfertaPopUpComponent } from '../oferta-popup/oferta-popup.component';
import { ClienteCompleto, ProdutoDetalhe, Usuario } from '@shared/models';
import { Filial, ItenVenda, VendaCompleta } from 'src/app/shared/models/venda';
import { VendaService } from 'src/app/shared/services/venda.service';

@Component({
  selector: 'app-produto-popup',
  templateUrl: './produto-popup.component.html',
  styleUrls: ['./produto-popup.component.scss']
})
export class ProdutoPopupComponent {
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  public produto!: ProdutoDetalhe;
  public filiaisRetira!: Filial[];
  public clienteCompleto: ClienteCompleto;
  public vendaCompleta: VendaCompleta;
  public itemVenda: ItenVenda;
  public usuario: Usuario;

  constructor(
    private dialog: DialogService,
    private produtoService: ProdutoService,
    private vendaService: VendaService,
    private storageService: StorageService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    this.loadFiliaisRetira();

    this.vendaCompleta = this.storageService.getVendaCompleta();
    this.clienteCompleto = this.storageService.getClienteCompleto();
    this.usuario = this.storageService.getUsuario();
    this.itemVenda = {} as ItenVenda;
    
    this.produtoService.getProdutoCompleto(
                            this.vendaCompleta.codigo_cliente,
                            this.clienteCompleto.regiao_cliente,
                            this.clienteCompleto.uf_entrega_cliente,
                            this.clienteCompleto.codigo_atividade_cliente,
                            this.clienteCompleto.codigo_rede_cliente,
                            this.vendaCompleta.codigo_rca,
                            0,
                            this.vendaCompleta.codigo_plan_pagamento_pedido,
                            data.id,
                            this.vendaCompleta.codigo_unidade_pedido
    ).subscribe((produtoDetalhe: any) => {
      this.produto = produtoDetalhe[0];
      this.itemVenda = this.inicializaItemVenda(this.vendaCompleta);
    });
  }

  private loadFiliaisRetira(): void {
    const subs = this.vendaService.getAllFiliais().subscribe((filiais) => {
      this.filiaisRetira = filiais;
    });
  }

  onCloseModal(): void {
    this.closeModal.emit();
  }

  onOpenModalValidade(): void {
    const venda = this.storageService.getVendaCompleta();
    const modal = this.dialog.show(ValidadePopupComponent,
      {
        produto: this.produto,
        venda: venda,
        itemVenda: this.itemVenda,
        permiteSelecao: true
      },
      [],
      true,
      true,
      '600px',
      '800px'
    );

    modal.componentInstance.closeModal.subscribe(() => {
      this.dialog.close(modal);
    });
  }

  onOpenModalOfertas(): void {
    const modal = this.dialog.show(OfertaPopUpComponent,
      {
        codigoUnidade: this.vendaCompleta.codigo_unidade_pedido,
        codigoProduto: this.produto.codigo_produto,
        codigoCliente: this.vendaCompleta.codigo_cliente,
        codigoRegiao: this.clienteCompleto.regiao_cliente,
        ufCliente: this.clienteCompleto.uf_entrega_cliente,
        codigoAtividade: this.clienteCompleto.codigo_atividade_cliente,
        codigoRede: this.clienteCompleto.codigo_rede_cliente,
        codigoRCA: this.usuario.rca_code,
        codigoSupervisor: this.usuario.supervisor_id,
        codigoPlanoPagamento: this.vendaCompleta.codigo_plan_pagamento_pedido,
      },
      []
    );

    modal.componentInstance.closeModal.subscribe(() => {
      this.dialog.close(modal);
    });
  }

  private inicializaItemVenda(vendaCompleta: VendaCompleta): ItenVenda {

    if (!vendaCompleta.itens || vendaCompleta.itens.length <= 0) {
      return this.novoItemVenda(this.produto);
    }

    let itemVenda: ItenVenda = vendaCompleta.itens.filter(ite => ite.codigo_produto == this.produto.codigo_produto).map(ite => ite)[0];

    if (!itemVenda) {
      return this.novoItemVenda(this.produto);
    }

    return itemVenda;
  }

  private novoItemVenda(produto: ProdutoDetalhe): ItenVenda {

    const dadosComerciais = this.produto.dados_comerciais;

    let precoVenda = dadosComerciais.precoTabela;
    if (dadosComerciais.percentualDescontoAutomatico != undefined && dadosComerciais.percentualDescontoAutomatico != 0) {
      precoVenda = precoVenda - (precoVenda * (dadosComerciais.percentualDescontoAutomatico / 100))
      precoVenda = parseFloat(precoVenda.toFixed(2));
    }
    
    return {
      codigo_pedido_rca: 0,
      codigo_rca: this.vendaCompleta.codigo_rca,
      data_hora_abertura_pedido: this.vendaCompleta.data_hora_abertura_pedido,
      item: this.vendaCompleta.itens.length + 1,
      codigo_produto: produto.codigo_produto,
      descricao_produto: produto.descricao_produto,
      quantidade: produto.multiplo_produto,
      preco_venda_original: dadosComerciais.precoTabela,
      preco_venda: precoVenda,
      codigo_barras: produto.codigo_ean.toString(),
      quantidade_faturada: 0,
      bonificacao: '',
      codigo_combo: 0,
      corte: '',
      percentual_desconto: dadosComerciais.percentualDescontoAutomatico,
      percnetual_desconto_boleto: 0,
      sugestao: '',
      codigo_pedido: 0,
      preco_venda_desconto: precoVenda,
      valor_total: dadosComerciais.precoTabela,
      valor_total_com_imposto: dadosComerciais.precoTabela,
      codigo_desconto3306: '',
      descricao_desconto3306: '',
      codigo_produto_principal: produto.codigo_produto_principal.toString(),
      observacao_retorno: '',
      codigo_unidade_retirada: this.vendaCompleta.codigo_unidade_pedido == undefined ? '' : this.vendaCompleta.codigo_unidade_pedido,
      tipo_entrega: this.storageService.getVendaCompletaTipoEntrega(),
      codigo_desconto561: '',
      diferenca_preco: 0,
      saldo_verba: 0,
      base_cred_deb_rca_descont561: '',
      aplica_automatico_desconto561: '',
      percentual_desconto561: 0,
      codigo_auxiliar_embalagem: '',
      quantidade_unitaria_embalagem: 0,
      utiliza_venda_por_embalagem: '',
      tipo_carga_produto: '',
      exibe_combo_embalagem: '',
      item_negociado: 'N',
      unidade_venda: produto.unidade_venda,
      tipo_estoque_produto: produto.tipo_estoque_produto,
      codigo_regiao: 0,
      percentual_acrescimo: 0,
      comissao: 0,
      peso: produto.peso_embalagem_venda,
      valor_st: 0,
      preco_st: dadosComerciais.precoTabela,
      valor_total_com_st: dadosComerciais.precoTabela,
      numero_carregamento: 0,
      percentual_base_red: 0,
      percentual_icm: 0,
      data_validade_campanha_shelf: undefined,
      preco_campanha_shelf: 0,
      codigo_campanha_shelf: '',
      unidade_frios: produto.unidade_venda,
      imgProduto: produto.imgProduto
    }
  }

  isVisibleTipoEntrega(): boolean {
    return this.vendaCompleta.condicao_venda_pedido == '7' ? true : false;
  }
}
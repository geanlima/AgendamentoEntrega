import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ConfigTabelaPopupComponent, OfertaPopUpComponent, ProdutoPopupComponent, ValidadePopupComponent } from '@core/components';
import { ProgressComponent } from '@shared/components';
import { DadoComerciais, Filtro, Produto } from '@shared/models';
import { DialogService, ProdutoService, StorageService } from '@shared/services';
import { Subscription } from 'rxjs';
import { ColunasTabela } from 'src/app/shared/models/colunas-tabela';
import { ItenVenda, VendaCompleta } from 'src/app/shared/models/venda';

@Component({
  selector: 'app-produto',
  templateUrl: './produto.component.html',
  styleUrls: ['./produto.component.scss']
})
export class ProdutoComponent {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Output() eventoAtualizaValores = new EventEmitter<string>();
  @Input() venda: VendaCompleta = {} as VendaCompleta;
  
  private readonly BASE64_STRING_PREFIX = 'data:image/png;base64,';
  private noImage = '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';

  private readonly VIEW_CODE: string = 'VIEW_VENDAS';
  filter: Filtro = { hasEstoque: "S" } as Filtro;

  private _subs: Subscription[] = [];
  
  private colunastabela: ColunasTabela[] = [
    { titulo: 'imgProduto', nome: 'imgProduto', selecionado: true, editavel: false },
    { titulo: 'Código', nome: 'codigo_produto', selecionado: true, editavel: true },
    { titulo: 'Nome', nome: 'descricao_produto', selecionado: true, editavel: true },
    { titulo: 'Marca', nome: 'marca_produto', selecionado: true, editavel: true },
    { titulo: 'Preço', nome: 'precoTabela', selecionado: true, editavel: true },
    { titulo: 'Preço s/ imposto', nome: 'precoSemImposto', selecionado: true, editavel: true },
    { titulo: 'Un. Venda', nome: 'unidade_venda', selecionado: true, editavel: true },
    { titulo: 'Qt. Caixa', nome: 'quantidade_embalagem_venda', selecionado: true, editavel: true },
    { titulo: 'Estoque', nome: 'estoque_disponivel', selecionado: true, editavel: true },
    { titulo: 'legendas', nome: 'legendas', selecionado: true, editavel: false },
    { titulo: 'actions', nome: 'actions', selecionado: true, editavel: false }
  ];

  public page: number = 0;
  public pageSize: number = 10;
  public searchTerm: string = '';
  public somaTotalCompra: number = 0.00;
  public dataSource!: MatTableDataSource<Produto>;

  public displayedColumns = this.colunastabela
    .filter(coluna => coluna.selecionado)
    .map(coluna => coluna.nome);

  constructor(
    private _router: Router,
    private produtoService: ProdutoService,    
    private storageService: StorageService,
    private dialogService: DialogService,
  ) {
    // const venda = this.storageService.getVendaCompleta();
    this.venda = this.storageService.getVendaCompleta();
    const clienteCompleto = this.storageService.getClienteCompleto();
    const progress = this.dialogService.showProgress(ProgressComponent);

    this.produtoService.getProdutos(
      this.venda.codigo_unidade_pedido,
      this.venda.codigo_cliente,
      0, //AQUI
      clienteCompleto.regiao_cliente
    ).subscribe((produtos: Produto[]) => {

      // produtos.forEach((p) => {
      //   p.dados_comerciais = JSON.parse(p.dados_comerciais as string);
      // });
      this.setDataSource(produtos);

      if (produtos) {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;

        this.onFilterChanged(this.filter);
      }

      this.dialogService.close(progress);
    });
  }

  

  sortValue(data: Produto, sortHeaderId: string): string | number {
    if (sortHeaderId === 'precoTabela') {
      return (data.dados_comerciais as DadoComerciais).precoTabela;
    }
    if (sortHeaderId === 'precoSemImposto') {
      return (data.dados_comerciais as DadoComerciais).precoSemImposto;
    }
    if (sortHeaderId === 'codigo_produto') {
      return data.codigo_produto;
    }
    if (sortHeaderId === 'quantidade_embalagem_venda') {
      const value = data[sortHeaderId as keyof Produto];
      return Number.parseFloat(value.toString());
    }
    if (sortHeaderId === 'estoque_disponivel') {
      return data.estoque_disponivel;
    }
    const value = data[sortHeaderId as keyof Produto];
    return value.toString();
  }

  private setDataSource(produtos: Produto[]) {
    //Filtra somente produtos com preço maior que zero    
    const produtosComPrecoTabela = produtos.filter((produto) => (produto.dados_comerciais as DadoComerciais).precoTabela > 0);
    this.dataSource = new MatTableDataSource(produtosComPrecoTabela);

    this.dataSource.sortingDataAccessor = this.sortValue;
  }

  onEnterOnSearch(searchTerm: string): void {
    if (!this.dataSource || !this.dataSource.filteredData || this.dataSource.filteredData.length != 1) return;
    this.onRowClicked(this.dataSource.filteredData[0]);
  }

  onSearchChanged(searchTerm: string): void {

    // this.searchTerm = searchTerm;
    // this.storageService.saveSearchFilter(this.VIEW_CODE, searchTerm);
    // this.dataSource.filter = searchTerm;
  }

  getImage64(img: string): string {
    const img64 = img ? img : this.noImage;
    return `${this.BASE64_STRING_PREFIX}${img64}`;
  }

  onRetornar(): void {
    const venda = this.storageService.getVendaCompleta();

    this._router.navigateByUrl(`/home/atendimento/${venda.codigo_pedido_rca}/N`);
  }

  sumProdutosSelecionados(event: MatCheckboxChange, produto: Produto): void {
    produto.isSelected = event.checked;
    if (event.checked) {
      this.somaTotalCompra += (produto.dados_comerciais as DadoComerciais).precoTabela;
    } else {
      this.somaTotalCompra -= (produto.dados_comerciais as DadoComerciais).precoTabela;
    }
  }

  onRowClicked(produto: Produto) {
    const modal = this.dialogService.show(ProdutoPopupComponent,
      { id: produto.codigo_produto },
      [],
    );

    modal.componentInstance.closeModal.subscribe(() => {
      this.dialogService.close(modal);

      this.eventoAtualizaValores.emit();
    });

  }

  hasSale(produto: Produto): boolean {
    return false;
  }

  hasNovoProduto(produto: Produto): boolean {
    const dadosComerciais = produto.dados_comerciais as DadoComerciais;
    return false;
  }

  hasCampanhaShelf(produto: Produto): boolean {
    return produto.possui_campanha_shelf == 'S';
  }

  hasPoliticaDesconto(produto: Produto): boolean {
    return false;
    // const dadosComerciais = produto.dados_comerciais as DadoComercial;
    // return dadosComerciais.codigoDesconto !== null ||
    //   dadosComerciais.codigoDesconto !== '0' ||
    //   dadosComerciais.codigoDescontoPrecoRca !== null ||
    //   dadosComerciais.codigoDescontoPrecoRca !== '0' ||
    //   dadosComerciais.codigoPrecoFixo !== null ||
    //   dadosComerciais.codigoPrecoFixo !== '0'
  }

  hasProdutoPositivado(produto: Produto): boolean {
    return produto.mix_cliente === 'S';
  }

  hasProdutoSemEstoque(produto: Produto): boolean {
    return produto.estoque_disponivel <= 0;
  }

  onFilterChanged(filtro: Filtro): void {

    if (!this.dataSource || !this.dataSource.data) return;

    var searchTerm = this.storageService.getSearchFilter(this.VIEW_CODE);

    this.dataSource.filterPredicate = (data, filter) => {
      let predicate: boolean = true;

      if (filtro.searchTerm && filtro.searchTerm != '') {

        let buscas = filtro.searchTerm.split(' ');

        if (buscas.length == 1) {
          predicate &&= this.buscaCodigoDescricaoProduto(buscas[0], data);;
        } else {
          buscas.forEach(busca => {
            predicate &&= this.buscaCodigoDescricaoProduto(busca, data);
          });
        }

      }

      if (filtro.codigoDepartamento && filtro.codigoDepartamento != '' && filtro.codigoDepartamento != '-1') {
        predicate &&= data.codigo_departamento.toString().toLowerCase().includes(filtro.codigoDepartamento);
      } else if (filtro.codigoDepartamento == '-1') {
        predicate &&= true;
      }

      if (filtro.codigoSecao && filtro.codigoSecao != '' && filtro.codigoSecao != '-1') {
        predicate &&= data.codigo_secao.toString().toLowerCase().includes(filtro.codigoSecao);
      } else if (filtro.codigoSecao == '-1') {
        predicate &&= true;
      }

      if (filtro.codigoCategoria && filtro.codigoCategoria != '' && filtro.codigoCategoria != '-1') {
        predicate &&= data.codigo_categoria.toString().toLowerCase().includes(filtro.codigoCategoria);
      } else if (filtro.codigoCategoria == '-1') {
        predicate &&= true;
      }

      if (filtro.codigoSubCategoria && filtro.codigoSubCategoria != '' && filtro.codigoSubCategoria != '-1') {
        predicate &&= data.codigo_subcategoria.toString().toLowerCase().includes(filtro.codigoSubCategoria);
      } else if (filtro.codigoSubCategoria == '-1') {
        predicate &&= true;
      }

      if (filtro.codigoFornecedor && filtro.codigoFornecedor != '' && filtro.codigoFornecedor != '-1') {
        predicate &&= data.codigo_fornecedor.toString().toLowerCase().includes(filtro.codigoFornecedor);
      } else if (filtro.codigoFornecedor == '-1') {
        predicate &&= true;
      }

      if (filtro.codigoMarca && filtro.codigoMarca != '' && filtro.codigoMarca != '-1') {
        predicate &&= data.codigo_marca.toString().toLowerCase().includes(filtro.codigoMarca);
      } else if (filtro.codigoMarca == '-1') {
        predicate &&= true;
      }

      if (filtro.hasEstoque == 'S') {
        predicate &&= data.estoque_disponivel > 0;
      } else if (filtro.hasEstoque == 'N') {
        predicate &&= true;
      }

      if (filtro.hasMixCliente == 'S') {
        predicate &&= data.mix_cliente.toString().includes(filtro.hasMixCliente);
      } else if (filtro.hasMixCliente == 'N') {
        predicate &&= true;
      }

      if (filtro.hasPrioridadeVenda == 'S') {
        predicate &&= data.possui_campanha_shelf.toString().includes(filtro.hasPrioridadeVenda);
      } else if (filtro.hasPrioridadeVenda == 'N') {
        predicate &&= true;
      }

      return predicate;
    };

    if (searchTerm) {
      this.dataSource.filter = searchTerm;
    }

    if (filtro.codigoDepartamento) {
      this.dataSource.filter = filtro.codigoDepartamento;
    }

    if (filtro.codigoCategoria) {
      this.dataSource.filter = filtro.codigoCategoria;
    }

    if (filtro.codigoSubCategoria) {
      this.dataSource.filter = filtro.codigoSubCategoria;
    }

    if (filtro.codigoFornecedor) {
      this.dataSource.filter = filtro.codigoFornecedor;
    }

    if (filtro.codigoMarca) {
      this.dataSource.filter = filtro.codigoMarca;
    }

    if (filtro.hasPrioridadeVenda) {
      this.dataSource.filter = filtro.hasPrioridadeVenda;
    }

    if (filtro.hasPromocao) {
      this.dataSource.filter = filtro.hasPromocao;
    }

    if (filtro.hasEstoque) {
      this.dataSource.filter = filtro.hasEstoque;
    }

    if (filtro.hasMixCliente) {
      this.dataSource.filter = filtro.hasMixCliente;
    }

  }

  buscaCodigoDescricaoProduto(busca: string, data: Produto): boolean {
    return (
      data.descricao_produto.toString().toLowerCase().includes(busca.toLowerCase()) ||
      data.codigo_produto.toString().toLowerCase() == busca.toLowerCase()
    );
  }

  onOpenModalOfertas(produto: Produto): void {
    const dadosComerciais = produto?.dados_comerciais as DadoComerciais ?? {} as DadoComerciais;
    const venda = this.storageService.getVendaCompleta();
    const clienteCompleto = this.storageService.getClienteCompleto();
    const usuario = this.storageService.getUsuario();

    const modal = this.dialogService.show(OfertaPopUpComponent,
      {
        codigoUnidade: venda.codigo_unidade_pedido,
        codigoProduto: produto.codigo_produto,
        codigoCliente: venda.codigo_cliente,
        codigoRegiao: clienteCompleto.regiao_cliente,
        ufCliente: clienteCompleto.uf_entrega_cliente,
        codigoAtividade: clienteCompleto.codigo_atividade_cliente,
        codigoRede: clienteCompleto.codigo_rede_cliente,
        codigoRCA: usuario.rca_code,
        codigoSupervisor: usuario.supervisor_id,
        codigoPlanoPagamento: venda.codigo_plan_pagamento_pedido,
      },
      []
    );

    modal.componentInstance.closeModal.subscribe(() => {
      this.dialogService.close(modal);
    });
  }

  onOpenModalValidade(produto: Produto): void {
    const venda = this.storageService.getVendaCompleta();
    const modal = this.dialogService.show(ValidadePopupComponent,
      {
        produto: produto,
        venda: venda,
        itemVenda: {} as ItenVenda,
        permiteSelecao: false
      },
      [],
      true,
      true,
      '600px',
      '800px'
    );

    modal.componentInstance.closeModal.subscribe(() => {
      this.dialogService.close(modal);
    });
  }

  configTabela() {
    const modalConfigTabela = this.dialogService.show(ConfigTabelaPopupComponent,
      { colunas: this.colunastabela },
      [],
      true,
      true,
      '500px',
      '350px'
    );

    modalConfigTabela.componentInstance.closeModal.subscribe((colunas) => {
      if (colunas.length > 0) {
        this.colunastabela = colunas;
        this.displayedColumns = this.colunastabela
          .filter(coluna => coluna.selecionado)
          .map(coluna => coluna.nome);
      }

      this.dialogService.close(modalConfigTabela);
    });
  }
}

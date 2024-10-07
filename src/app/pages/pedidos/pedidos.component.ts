import { SelectionModel } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ConfigTabelaPopupComponent } from '@core/components';
import { DialogService } from '@shared/services';
import { Observable, Subscription } from 'rxjs';
import { ProcessPopupComponent } from 'src/app/core/components/process-popup/process-popup.component';
import { ColunasTabela } from 'src/app/shared/models/colunas-tabela';
import { TipoVenda } from 'src/app/shared/models/pedido';
import { Venda } from 'src/app/shared/models/venda';
import { DialogConfirmationService } from 'src/app/shared/services/dialog-confirmation.service';
import { MockService } from 'src/app/shared/services/mock.service';
import { VendaService } from 'src/app/shared/services/venda.service';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss']
})
export class PedidosComponent implements OnDestroy {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public displayedColumns = ['select', 'rca_order_id', 'date', 'client_code', 'order_number_erp', 'fantasy_name', 'type_sale', 'total_order_amount', 'status', 'payment_situation_erp', 'action'];
  public dataSource!: MatTableDataSource<Venda>;
  public page: number = 0;
  public pageSize: number = 10;
  public vendas: Venda[] = [];
  public filteredVendas: Venda[] = [];
  public hasAguardandoEnvio: boolean = false;


  filterOptions = {
    numPedidoFV: '',
    numPedidoERP: '',
    codCliente: '',
    tipoVenda: '',
    dataEmissaoInicial: '',
    dataEmissaoFinal: '',
    checkEmCarregamento: true,
    checkFaturado: true,
    checkLiberado: true,
    checkBloqueado: true,
    checkCancelado: false,
    checkAberto: true,
    checkFechado: true,
    checkTrasmitido: true,
  };

  public searchDisabled: boolean = false;

  public tipovenda$!: Observable<TipoVenda[]>;

  private _subs: Subscription[] = [];

  private colunastabela: ColunasTabela[] = [
    { titulo: 'Número Pedido FV', nome: 'rca_order_id', selecionado: true, editavel: true },
    { titulo: 'Data Pedido', nome: 'date', selecionado: true, editavel: true },
    { titulo: 'Código Cliente', nome: 'client_code', selecionado: true, editavel: true },
    { titulo: 'Razão Social', nome: 'fantasy_name', selecionado: true, editavel: true },
    { titulo: 'Número ERP', nome: 'order_number_erp', selecionado: true, editavel: true },
    { titulo: 'Tipo Venda', nome: 'type_sale', selecionado: true, editavel: true },
    { titulo: 'Valor', nome: 'total_order_amount', selecionado: true, editavel: true },
    { titulo: 'Status', nome: 'status', selecionado: true, editavel: true },
    { titulo: 'Situação', nome: 'payment_situation_erp', selecionado: true, editavel: true },
    { titulo: 'action', nome: 'action', selecionado: true, editavel: false }
  ];

  constructor(
    private _vendaService: VendaService,
    private _mockService: MockService,
    private _router: Router,
    private _dialogConfirmation: DialogConfirmationService,
    private _http: HttpClient,
    private _dialogService: DialogService,
    private dialog: MatDialog,
  ) {
    this.loadVendas();
    this.tipovenda$ = this._http.get<TipoVenda[]>('./../assets/data/tipovenda.json');
  }

  selection = new SelectionModel<Venda>(true, []);
  
  ngOnDestroy(): void {
    this._subs.forEach((sub: Subscription) => sub.unsubscribe());
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.filter(venda => venda.status === 'AGUARDANDO ENVIO').length;
    return numSelected === numRows;
  }

  isIndeterminate() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.filter(venda => venda.status === 'AGUARDANDO ENVIO').length;
    return numSelected > 0 && numSelected < numRows;
  }

  selectAllRows() {
    const filteredData = this.dataSource.data.filter(venda => venda.status === 'AGUARDANDO ENVIO');
    
    if (this.isAllSelected()) {
      this.selection.clear(); // Desmarca todos os itens se todos estiverem selecionados
    } else {
      filteredData.forEach(row => this.selection.select(row)); // Seleciona todos os itens filtrados
    }
  }

  toggleSelection(venda: Venda) {
    this.selection.toggle(venda);
  }

  isSelected(venda: Venda) {
    return this.selection.isSelected(venda);
  }

  private setDataSource(vendas: Venda[]) {
    this.dataSource = new MatTableDataSource(vendas);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  private loadVendas(): void {

    const subs = this._vendaService.getAllVendas().subscribe((vendas) => {

      this.vendas = vendas;      
      this.filteredVendas = this.vendas;
      this.hasAguardandoEnvio = this.vendas.some(venda => venda.status === 'AGUARDANDO ENVIO'); // Atualiza o indicador
      this.onSearchChanged();
    });

    this._subs.push(subs);
  }

  getTipoVenda(idTipoVenda: string): string {
    let strReturn = '';

    switch (idTipoVenda) {
      case '1':
        strReturn = "Venda Normal";
        break;
      case '5':
        strReturn = "Bonificação";
        break;
      default:
        break;
    }

    return strReturn;
  }

  showPedidoRetorno(venda: Venda) {
    const resposta = this._dialogConfirmation.openDialog({
      header: 'Retorno do pedido',
      message: this.trataMensagemRetornoPedido(venda),
      txtAct: 'Ok',
    });
  }

  trataMensagemRetornoPedido(venda: Venda): string {
    const mensagem = venda.observation_return;
    const div = document.createElement('div');
    div.innerHTML = mensagem;
    return div.textContent || div.innerText || '';
  }

  onSearchChanged(): void {    
    this.filteredVendas = this.vendas.filter(venda =>
      (this.filterOptions.numPedidoFV ? venda.rca_order_id.toString().includes(this.filterOptions.numPedidoFV) : true) &&
      (this.filterOptions.numPedidoERP ? venda.order_number_erp.toString().includes(this.filterOptions.numPedidoERP) : true) &&
      (this.filterOptions.codCliente ? venda.client_code.toString().includes(this.filterOptions.codCliente) : true) &&
      (this.filterOptions.tipoVenda ? venda.type_sale.includes(this.filterOptions.tipoVenda) : true)
    );
    

    this.setDataSource(this.filteredVendas);
  }

  onTransmitirPedido(venda: Venda): void {
    this.selection.clear();

    this.selection.select(venda);

    this.showProcessamentoPedidos();
  }

  onEditPedido(venda: Venda): void {
    this._router.navigate(['/home/atendimento-edit/', venda.rca_order_id]);
  }

  onSearchChangedNumPedidoFV(searchTerm: string): void {
    this.filterOptions.numPedidoFV = searchTerm;
  }

  onSearchChangednumPedidoERP(searchTerm: string): void {
    this.filterOptions.numPedidoERP = searchTerm;
  }

  onSearchChangedCodCliente(searchTerm: string): void {
    this.filterOptions.codCliente = searchTerm;
  }

  onEnterOnSearch(valor: string) {

  }

  onClearFilters(): void {

    this.filterOptions = {
      numPedidoFV: '',
      numPedidoERP: '',
      codCliente: '',
      tipoVenda: '',
      dataEmissaoInicial: '',
      dataEmissaoFinal: '',
      checkEmCarregamento: true,
      checkFaturado: true,
      checkLiberado: true,
      checkBloqueado: true,
      checkCancelado: false,
      checkAberto: true,
      checkFechado: true,
      checkTrasmitido: true,
    };

    this.filteredVendas = this.vendas;

    this.onSearchChanged();
  }

  compareSelect(object1: any, object2: any) {
    return object1 && object2 && object1.id == object2.id;
  }

  onConsultarVenda(venda: Venda): void {
    this._router.navigate(['/home/atendimento', venda.rca_order_id, 'S']);
  }

  onImprimirVenda(venda: Venda): void {

  }

  showProcessamentoPedidos() {
    const selectedVendas = this.selection.selected;
    if (selectedVendas.length === 0) {
  
      this._dialogConfirmation.openDialog({
        header: 'Aviso',
        message: 'Nenhum pedido foi selecionado!',
        txtAct: 'Ok',
      });
      return;
    }
  
    const dialogRef = this._dialogService.open(ProcessPopupComponent, {
      width: '1000px',
      height: '800px',
      data: { selectedPedidos: selectedVendas }
    });
  
    dialogRef.afterClosed().subscribe(result => {
  
      this.loadVendas();
    });
  }
  
  configTabela() {
    const modalConfigTabela = this._dialogService.show(ConfigTabelaPopupComponent,
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
        
        this.displayedColumns = ['select', ...this.colunastabela
          .filter(coluna => coluna.selecionado)
          .map(coluna => coluna.nome)];
      }
  
      this._dialogService.close(modalConfigTabela);
    });
  }
}



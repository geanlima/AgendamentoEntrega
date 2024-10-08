import { AfterViewInit, Component, EventEmitter, OnDestroy, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Cliente } from '@shared/models';
import { ClienteService, DialogService, ShortcutService, StorageService } from '@shared/services';
import { Subscription } from 'rxjs';
import { PedidoFornecedor } from 'src/app/pages/fornecedor/pedido-fornecedor/pedidofornecedor';
import { Fornecedor } from 'src/app/shared/models/fornecedor';
import { DialogConfirmationService } from 'src/app/shared/services/dialog-confirmation.service';
import { FornecedorService } from 'src/app/shared/services/fornecedor.service';
import { environment } from 'src/environments/environment';
import { InclusaoAgendamentoComponent } from '../inclusao-agendamento/inclusao-agendamento.component';
import { ProgressComponent } from '@shared/components';

@Component({
  selector: 'app-pedido-fornecedor',
  templateUrl: './pedido-fornecedor.component.html',
  styleUrls: ['./pedido-fornecedor.component.scss']
})
export class PedidoFornecedorComponent implements AfterViewInit, OnDestroy{
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();
  @Output() agendamentoInserido: EventEmitter<void> = new EventEmitter<void>();

  private _subs: Subscription[] = [];

  private readonly VIEW_CODE: string = 'POPUP_ATENDIMENTO';

  public page: number = 0;
  public pageSize: number = 8;
  public searchTerm: string = '';
  public dataSource!: MatTableDataSource<Cliente>;
  public dataSourceFornecedor!: MatTableDataSource<PedidoFornecedor>;
  public displayedColumns = ['numPed', 'dtemissao', 'vlTotalLiquido', 'vlPendente', 'qtPendente'];

  constructor(
    private storageService: StorageService,
    private _fornecedorService: FornecedorService,
    private dialog: DialogService,

  ) { }

  ngAfterViewInit(): void {
    
    this.loadFornecedor((this.storageService.getUsuario()).id.toString());
  }


  ngOnDestroy(): void {
    this._subs.forEach((sub: Subscription) => sub.unsubscribe());
  }

  onCloseModal(): void {
    this.closeModal.emit();
  }

  onEnterOnSearch(valor: string): void {
    
  }

  onSearchChanged(searchTerm: string): void {
    this.storageService.saveSearchFilter(this.VIEW_CODE, searchTerm);
    this.dataSource.filter = searchTerm;
  }

  onRowClickedPedFornecedor(pedido: PedidoFornecedor) {

    const modalAgendamento = this.dialog.show(InclusaoAgendamentoComponent,
      {pedido: pedido.numPed},
      ['override-modal-atendimento'],
      true,
      true,
      '800px',
      '1000px'
    );

    modalAgendamento.componentInstance.closeModal.subscribe(() => {
      this.dialog.close(modalAgendamento);
      this.agendamentoInserido.emit();
    });
  }

  loadFornecedor(fornId: string): void{
    const progress = this.dialog.showProgress(ProgressComponent);
    const subs = this._fornecedorService.getPedidoFornecedor(fornId).subscribe((fornecedor) => {
      this.setDataSourceFornecedor(fornecedor);
      this.setFilter();
      this.dialog.close(progress);
    });

    this._subs.push(subs);
  }

  private setDataSourceFornecedor(fornecedor: PedidoFornecedor[]) {
    this.dataSourceFornecedor = new MatTableDataSource(fornecedor);
    this.dataSourceFornecedor.sort = this.sort;
    this.dataSourceFornecedor.paginator = this.paginator;
  }

  private setFilter(): void {
    this.searchTerm = this.storageService.getSearchFilter(this.VIEW_CODE);
    if (this.searchTerm) {
      this.dataSource.filter = this.searchTerm;
    }
  }
}

import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Agendamento } from '../agendamento/models/agendamento';
import { InclusaoAgendamentoComponent } from 'src/app/core/components/inclusao-agendamento/inclusao-agendamento.component';
import { DialogService, ShortcutService, StorageService } from '@shared/services';
import { Subscription } from 'rxjs';
import { PedidoFornecedorComponent } from 'src/app/core/components/pedido-fornecedor/pedido-fornecedor.component';
import { AgendamentoService } from 'src/app/shared/services/agendamento.service';
import { ProgressComponent } from '@shared/components';


@Component({
  selector: 'app-agendamento',
  templateUrl: './agendamento.component.html',
  styleUrls: ['./agendamento.component.scss']
})
export class AgendamentoComponent implements AfterViewInit, OnDestroy {

  agendamentos: Agendamento[] = [];
  fornId: number = 0;
  
  displayedColumns: string[] = ['id', 'pedido','data','status', 'acoes'];
  dataSource!: MatTableDataSource<Agendamento>;

  private subs$: Subscription[] = [];
  
  constructor(private dialog: DialogService,
              private agendamentoService: AgendamentoService,
              private storageService: StorageService
  ) {
    this.dataSource = new MatTableDataSource(this.agendamentos);
    this.fornId = (this.storageService.getUsuario()).id;
  }

  ngOnDestroy(): void {
    this.subs$.forEach((sub: Subscription) => {
      if (sub && !sub.closed) {
        sub.unsubscribe()
      }
    });
  }

  ngAfterViewInit(): void {
    this.loadAgendamentos();
  }

  loadAgendamentos(): void {
    const progress = this.dialog.showProgress(ProgressComponent);
    const subs = this.agendamentoService.getAgendamento(this.fornId.toString()).subscribe((agendamento) => {
      this.setDataSource(agendamento);
      this.dialog.close(progress);
    });

    this.subs$.push(subs);
  }

  private setDataSource(agendamento: Agendamento[]) {
    this.dataSource = new MatTableDataSource(agendamento);
  }

  onAgendamentoPedido(): void {
    const modalAgendamento = this.dialog.show(PedidoFornecedorComponent,
      {},
      ['override-modal-atendimento'],
      true,
      true,
      '800px',
      '1800px'
    );

    modalAgendamento.componentInstance.closeModal.subscribe(() => {
      this.dialog.close(modalAgendamento);
    });
  }

  onIncluirAgendamento(): void {
    const modalAgendamento = this.dialog.show(InclusaoAgendamentoComponent,
      {},
      ['override-modal-atendimento'],
      true,
      true,
      '800px',
      '1800px'
    );

    modalAgendamento.componentInstance.closeModal.subscribe(() => {
      this.dialog.close(modalAgendamento);
    });
  }

  confirmarAgendamento(agendamento: Agendamento): void {
    const progress = this.dialog.showProgress(ProgressComponent);

    agendamento.status = 'Confirmado';
    this.agendamentoService.updateAgendamento(agendamento).subscribe({
      next: () => {        
        this.dialog.close(progress);
        this.loadAgendamentos();
      },
      error: (error) => {
        console.error('Erro ao confirmar agendamento:', error);
      }
    });
  }  
}


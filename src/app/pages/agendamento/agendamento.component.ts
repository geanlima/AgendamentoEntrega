import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Agendamento } from '../agendamento/models/agendamento';
import { InclusaoAgendamentoComponent } from 'src/app/core/components/inclusao-agendamento/inclusao-agendamento.component';
import { DialogService, ShortcutService } from '@shared/services';
import { Subscription } from 'rxjs';
import { PedidoFornecedorComponent } from 'src/app/core/components/pedido-fornecedor/pedido-fornecedor.component';


@Component({
  selector: 'app-agendamento',
  templateUrl: './agendamento.component.html',
  styleUrls: ['./agendamento.component.scss']
})
export class AgendamentoComponent implements OnInit, OnDestroy {

  agendamentos: Agendamento[] = [];
  
  displayedColumns: string[] = ['id', 'pedido','data', 'horario', 'status'];
  dataSource: MatTableDataSource<Agendamento>;  
  private subs$: Subscription[] = [];

  constructor(private dialog: DialogService,
              private shortcut: ShortcutService
  ) {
    this.dataSource = new MatTableDataSource(this.agendamentos);
  }

  ngOnDestroy(): void {
    this.subs$.forEach((sub: Subscription) => {
      if (sub && !sub.closed) {
        sub.unsubscribe()
      }
    });
  }

  ngOnInit(): void {

    const subs = this.shortcut.addShortcut({ keys: 'shift.v' })
      .subscribe(() => {
        this.loadAgendamentos();
      });
    this.subs$.push(subs);
  }

  loadAgendamentos(): void {
    // Exemplo de agendamentos (inicialmente vazio)
    this.agendamentos = [
      { id: 1, pedido: "123456", data: '2024-10-07', horario: '14:00', status: 'Pendente' },
    ];

    // Atualizar o dataSource da tabela
    this.dataSource.data = this.agendamentos;
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
      '350px',
      '500px'
    );

    modalAgendamento.componentInstance.closeModal.subscribe(() => {
      this.dialog.close(modalAgendamento);
    });
  }
}


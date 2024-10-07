import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Agendamento } from '../agendamento/models/agendamento';
import { InclusaoAgendamentoComponent } from 'src/app/core/components/inclusao-agendamento/inclusao-agendamento.component';
import { DialogService, ShortcutService } from '@shared/services';
import { Subscription } from 'rxjs';
import { AgendamentoService } from 'src/app/shared/services/agendamento.service';


@Component({
  selector: 'app-fornecedor',
  templateUrl: './fornecedor.component.html',
  styleUrls: ['./fornecedor.component.scss']
})
export class FornecedorComponent implements OnInit, OnDestroy {

  agendamentos: Agendamento[] = [];
  
  displayedColumns: string[] = ['id', 'pedido','data', 'horario', 'status'];
  dataSource: MatTableDataSource<Agendamento>;  

  private subs$: Subscription[] = [];

  constructor(private dialog: DialogService,
              private shortcut: ShortcutService,
              private agendamentoservice: AgendamentoService
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
        this.loadAgendamentos("111");
      });
    this.subs$.push(subs);
  }

  loadAgendamentos(fornecedorId: string): void {
    const subs = this.agendamentoservice.getAgendamento(fornecedorId).subscribe((agendamento) => {
      this.setDataSource(agendamento);
    });
    this.subs$.push(subs);
  }

  private setDataSource(agendamento: Agendamento[]) {
    this.dataSource = new MatTableDataSource(agendamento);
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

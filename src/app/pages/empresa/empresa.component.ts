import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { Agendamento } from '../agendamento/models/agendamento';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { DialogService, ShortcutService, StorageService } from '@shared/services';
import { AgendamentoService } from 'src/app/shared/services/agendamento.service';

@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.scss']
})

export class EmpresaComponent implements OnDestroy, AfterViewInit {
  agendamentos: Agendamento[] = [];
  fornId: number = 0;
  
  displayedColumns: string[] = ['id', 'pedido','data', 'horario', 'status'];
  dataSource!: MatTableDataSource<Agendamento>;

  private subs$: Subscription[] = [];
  
  constructor(private agendamentoService: AgendamentoService,
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
    const subs = this.agendamentoService.getAllAgendamento().subscribe((agendamento) => {
      this.setDataSource(agendamento);
    });

    this.subs$.push(subs);
  }

  private setDataSource(agendamento: Agendamento[]) {
    this.dataSource = new MatTableDataSource(agendamento);
  }

  
}

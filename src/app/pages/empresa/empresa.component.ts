import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { Agendamento } from '../agendamento/models/agendamento';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { NotificationService, StorageService } from '@shared/services';
import { AgendamentoService } from 'src/app/shared/services/agendamento.service';
import { TypeToast } from '@shared/enums';

@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.scss']
})

export class EmpresaComponent implements OnDestroy, AfterViewInit {
  agendamentos: Agendamento[] = [];
  fornId: number = 0;
  
  displayedColumns: string[] = ['id', 'pedido', 'data', 'status', 'acoes'];
  dataSource!: MatTableDataSource<Agendamento>;

  private subs$: Subscription[] = [];
  
  constructor(private agendamentoService: AgendamentoService,
              private storageService: StorageService,
              private _notificationService: NotificationService
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

  confirmarAgendamento(agendamento: Agendamento): void { 
    
    this.agendamentoService.updateAgendamento(agendamento).subscribe({
      next: (response) => {
        this._notificationService.showToast({
          message: "Agendamento confirmado com sucesso",
          typeToast: TypeToast.SUCCESS
        });
      },
      error: (error) => {
        console.error('Erro ao salvar agendamento:', error);
      }
    });
  }

  sugerirData(agendamento: Agendamento): void {
    console.log('Sugerir data para agendamento:', agendamento);
  }
  
}

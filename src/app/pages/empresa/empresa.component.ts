import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { Agendamento } from '../agendamento/models/agendamento';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { DialogService, NotificationService, StorageService } from '@shared/services';
import { AgendamentoService } from 'src/app/shared/services/agendamento.service';
import { TypeToast } from '@shared/enums';
import { ProgressComponent } from '@shared/components';

@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.scss']
})

export class EmpresaComponent implements OnDestroy, AfterViewInit {
  agendamentos: Agendamento[] = [];
  fornId: number = 0;
  isConfirmacao: boolean = true;
  
  displayedColumns: string[] = ['id', 'pedido', 'fornecedorId', 'data', 'status', 'acoes'];
  dataSource!: MatTableDataSource<Agendamento>;

  private subs$: Subscription[] = [];
  
  constructor(private agendamentoService: AgendamentoService,
              private storageService: StorageService,
              private _notificationService: NotificationService,
              private _dialogService: DialogService
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
    const progress = this._dialogService.showProgress(ProgressComponent);
    const subs = this.agendamentoService.getAllAgendamento().subscribe((agendamento) => {
      agendamento.forEach(a => a.mostrarCalendario = false); // Inicializa a propriedade para controlar a visibilidade do calendário
      this.setDataSource(agendamento);
      this._dialogService.close(progress);
    });
  
    this.subs$.push(subs);
  }  

  private setDataSource(agendamento: Agendamento[]) {
    this.dataSource = new MatTableDataSource(agendamento);
  }

  confirmarAgendamento(agendamento: Agendamento): void { 
    const progress = this._dialogService.showProgress(ProgressComponent);
    this.agendamentoService.updateAgendamento(agendamento).subscribe({
      next: (response) => {
        this._dialogService.close(progress);
        agendamento.status = "Confirmado";
        this._notificationService.showToast({
          message: "Agendamento confirmado com sucesso",
          typeToast: TypeToast.SUCCESS
        });
        this.loadAgendamentos();
      },
      error: (error) => {
        console.error('Erro ao confirmar agendamento:', error);
      }
    });
  }

  sugestaoAgendamento(agendamento: Agendamento): void { 
    const progress = this._dialogService.showProgress(ProgressComponent);
    agendamento.status = "Nova data sugerida";
    this.agendamentoService.updateAgendamento(agendamento).subscribe({
      next: (response) => {
        this._dialogService.close(progress);
        
        this._notificationService.showToast({
          message: "Nova data sugerida com sucesso",
          typeToast: TypeToast.SUCCESS
        });

        this.loadAgendamentos();
      },
      error: (error) => {
        console.error('Erro ao sugestao agendamento:', error);
      }
    });
  }
  sugerirData(agendamento: Agendamento, novaData: string): void {
    agendamento.dataAgendamento = novaData;
    agendamento.mostrarCalendario = false; 
    this.sugestaoAgendamento(agendamento);
    
  }
  
}

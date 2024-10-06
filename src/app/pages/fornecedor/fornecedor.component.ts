import { Component, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Agendamento } from '../agendamento/models/agendamento';


@Component({
  selector: 'app-fornecedor',
  templateUrl: './fornecedor.component.html',
  styleUrls: ['./fornecedor.component.scss']
})
export class FornecedorComponent implements OnDestroy {
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

  displayedColumns: string[] = ['id', 'data', 'horario', 'status'];
  dataSource: MatTableDataSource<Agendamento>;

  agendamentos: Agendamento[] = [];

  constructor(private dialog: MatDialog) {
    this.dataSource = new MatTableDataSource(this.agendamentos);
  }

  ngOnInit(): void {
    // Carregar agendamentos já existentes (se houver)
    this.loadAgendamentos();
  }

  loadAgendamentos(): void {
    // Exemplo de agendamentos (inicialmente vazio)
    this.agendamentos = [
      { id: 1, data: '2024-10-07', horario: '14:00', status: 'Pendente' },
    ];

    // Atualizar o dataSource da tabela
    this.dataSource.data = this.agendamentos;
  }

  // Abre o modal de incluir agendamento
  onIncluirAgendamento(): void {
    /*const dialogRef = this.dialog.open(IncluirAgendamentoComponent, {
      width: '400px',
      data: { id: this.agendamentos.length + 1 }
    });
    // Atualiza o grid após o modal ser fechado
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Adiciona o novo agendamento à lista
        this.agendamentos.push(result);
        this.dataSource.data = this.agendamentos;
      }
    });*/
  }

}

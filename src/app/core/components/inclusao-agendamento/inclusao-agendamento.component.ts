import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-inclusao-agendamento',
  templateUrl: './inclusao-agendamento.component.html',
  styleUrls: ['./inclusao-agendamento.component.scss']
})
export class InclusaoAgendamentoComponent {
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  agendamento = {
    pedido: this.data.pedido,
    data: this.calculateNextWorkingDay(),
    horario: '14:00'
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<InclusaoAgendamentoComponent>
  ) {}

  onSave(): void {
    console.log('Agendamento salvo:', this.agendamento);
    // Aqui você pode implementar a lógica de salvar os dados
  }

  onClose(): void {
    this.dialogRef.close();  // Fecha o modal
  }

  calculateNextWorkingDay(): Date {
    let hours = 72;
    let currentDate = new Date();
    let nextWorkingDay = new Date(currentDate);

    while (hours > 0) {
      nextWorkingDay.setDate(nextWorkingDay.getDate() + 1);
      if (this.isWorkingDay(nextWorkingDay)) {
        hours -= 24;
      }
    }

    return nextWorkingDay;
  }

  isWorkingDay(date: Date): boolean {
    const day = date.getDay();
    return day !== 0 && day !== 6; // 0 é domingo e 6 é sábado
  }
}

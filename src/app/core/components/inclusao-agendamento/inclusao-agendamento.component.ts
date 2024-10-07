import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TypeToast } from '@shared/enums';
import { NotificationService } from '@shared/services';
import { Agendamento } from 'src/app/pages/agendamento/models/agendamento';
import { AgendamentoService } from 'src/app/shared/services/agendamento.service';

@Component({
  selector: 'app-inclusao-agendamento',
  templateUrl: './inclusao-agendamento.component.html',
  styleUrls: ['./inclusao-agendamento.component.scss']
})
export class InclusaoAgendamentoComponent {
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>(); 

  agendamento: Agendamento;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<InclusaoAgendamentoComponent>,    
    private _agendamentoService: AgendamentoService,
    private _notificationService: NotificationService,

  ) {
    this.agendamento = {
      id: 0, // ID será gerado no backend
      fornecedorId: 111,//this.data.fornecedorId,
      dataSolicitacao: this.formatDate(new Date()).toString(), // Data de solicitação como a data atual
      dataAgendamento: this.formatDate(this.calculateNextWorkingDay()).toString(), // Data de agendamento calculada
      tipoCarga: '', // Será preenchido pelo usuário (P = Paletizado / B = Batido)
      qtdVolumes: 0, // Inicializado com valor padrão
      qtdPaletes: undefined, // Inicializado como undefined, habilitado se tipoCarga = 'P'
      peso: 0, // Inicializado com valor padrão
      status: 'Pendente', // Status inicial como pendente
      numeroPedido: this.data.pedido,
      numeroNota: 0, // Número da nota será preenchido posteriormente
      pdfNota: "", // Inicializa com um Blob vazio, será preenchido posteriormente
      xmlNota: "" // Inicializa com um Blob vazio, será preenchido posteriormente
    };
  } 

  onSave(): void {        
    this._agendamentoService.saveAgendamento(this.agendamento).subscribe({
      next: (response) => {
        console.log('Agendamento salvo com sucesso:', response);

        this._notificationService.showToast({
          message: "Agendamento salvo com sucesso",
          typeToast: TypeToast.SUCCESS
        });

        this.dialogRef.close();
        this.closeModal.emit();
      },
      error: (error) => {
        console.error('Erro ao salvar agendamento:', error);
      }
    });
  }

  onClose(): void {
    this.dialogRef.close();
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

  onFileSelected(event: Event, fileType: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
  
      if (fileType === 'pdfNota') {
        this.agendamento.pdfNota = "";
      } else if (fileType === 'xmlNota') {
        this.agendamento.xmlNota = "";
      }
    }
  }
  
  isWorkingDay(date: Date): boolean {
    const day = date.getDay();
    return day !== 0 && day !== 6; // 0 é domingo e 6 é sábado
  }

  formatDate(date: Date | string): string {
    if (date instanceof Date) {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    return date; // Se já for uma string, retorna como está
  }
}

export class Agendamento {
    id: number;    
    data: string;   // A data pode ser uma string (no formato 'YYYY-MM-DD') ou um objeto Date
    horario: string; // Horário no formato 'HH:mm'
    status: string;
    pedido: string;
  
    constructor(id: number, pedido: string, data: string, horario: string, status: string) {
      this.id = id;
      this.data = data;
      this.horario = horario;
      this.status = status;
      this.pedido = pedido;
    }
  }
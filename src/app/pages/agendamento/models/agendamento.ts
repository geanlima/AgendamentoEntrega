export class Agendamento {
  id: number;
  fornecedorId: number;
  dataSolicitacao: string; // A data de solicitação no formato 'YYYY-MM-DD'
  dataAgendamento: string; // A data de agendamento no formato 'YYYY-MM-DD'
  tipoCarga: string; // P = Paletizado / B = Batido
  qtdVolumes: number;
  qtdPaletes?: number; // Opcional, habilitado apenas se tipoCarga for 'P'
  peso: number; // Peso da carga
  status: string; // P = Pendente / A = Agendado
  numeroPedido: number; // Número do pedido
  numeroNota: number; // Número da nota
  pdfNota: string; // Arquivo PDF da nota
  xmlNota: string; // Arquivo XML da nota
  mostrarCalendario: boolean;

  
  constructor(
    id: number,
    fornecedorId: number,
    dataSolicitacao: string,
    dataAgendamento: string,
    tipoCarga: string,
    qtdVolumes: number,
    qtdPaletes: number | undefined,
    peso: number,
    status: string,
    numeroPedido: number,
    numeroNota: number,
    pdfNota: string,
    xmlNota: string,
    mostrarCalendario: boolean
  ) {
    this.id = id;
    this.fornecedorId = fornecedorId;
    this.dataSolicitacao = dataSolicitacao;
    this.dataAgendamento = dataAgendamento;
    this.tipoCarga = tipoCarga;
    this.qtdVolumes = qtdVolumes;
    this.qtdPaletes = qtdPaletes;
    this.peso = peso;
    this.status = status;
    this.numeroPedido = numeroPedido;
    this.numeroNota = numeroNota;
    this.pdfNota = pdfNota;
    this.xmlNota = xmlNota;
    this.mostrarCalendario = mostrarCalendario;
  }
}

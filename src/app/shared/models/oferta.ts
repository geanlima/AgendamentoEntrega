export interface Oferta {
  dataInicio: Date;
  dataFim: Date;
  desconto: number;
  qtdMinima: number;
  qtdMaxima: number;
  aplicaDesconto: boolean;
}

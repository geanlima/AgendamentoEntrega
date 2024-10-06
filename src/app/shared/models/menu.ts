export interface Menu {
  nome: string;
  rota: string;
  indice: number;
  filhos?: Menu[];
  habilitado: boolean;
}

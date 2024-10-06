import { ItemHistorico } from "./item-historico";
export interface HistoricoPedidos {
    dataPedido: string;
    numeroPedido: number;
    origemVenda: string;
    descricaoCondVenda: string;
    descricaoPlanoPagamento: string;
    cobranca: string;
    valorTotal: number;
    pesoBruto: number;
    observacoes: string;
    situacao: string;
    numeroPedidoCliente: number;
    quantidadeitens: number;
    itens: ItemHistorico[];
}

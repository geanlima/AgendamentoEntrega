import { Devolucoes } from "./devolucoes";
import { HistoricoPedidos } from "./historico-pedidos";
import { MixIdeal } from "./mix-ideal";
import { Oportunidade } from "./oportunidade";
import { Titulo } from "./titulo";

export interface PainelAtendimento {
    codigo_cliente: number;
    razao_social: string;
    fantasia: string;
    cnpj: string;
    endereco_entrega: string;
    numero_entrega: string;
    bairro_entrega: string;
    cidade_entrega: string;
    uf_entrega: string;
    limite_credito: number;
    saldo_disponivel: number;
    data_primeira_compra: Date;
    data_ultima_compra: Date;
    tempo_relacionamento: number;
    dias_sem_compra: number;
    media_atraso: number;
    titulos_vencidos: number;
    titulos_a_vencer: number;
    maior_compra: number;
    menor_compra: number;
    ticket_medio: number;
    prazo_medio_pagamento: number;
    mix_ideal: number;
    cardDevolucao: CardDevolucao[];
    vendas: { [key: string]: number };
    pedidos: HistoricoPedidos[];
    oportunidades: Oportunidade[];
    titulos: Titulo[];
    devolucoes: Devolucoes[];
    mixIdealItens: MixIdeal[];
}

export interface CardDevolucao {
    qtNf: number;
    vlTotal: number;
}

export interface TipoVenda {
    id: number;
    descricao: string;
}

export interface TipoEntrega {
    id: string;
    descricao: string;
}

export interface OrigemPedido {
    id: number;
    descricao: string;
}

export interface ItemPedido {
    codigo: number;
    nome: string;
    preco: number;
    quantidade: number;
    unidade: number;
    emabalagem: string;
    total: number;
}
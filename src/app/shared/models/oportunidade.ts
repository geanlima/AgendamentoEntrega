export interface Oportunidade {
    idoportunidade: number;
    tipo: string;
    codigo: number | undefined;
    descricao: string;
    observacao: string;
    codigoCliente: number;
    codigoUnidade: string;
    codigoRca: number;
    status: string;
}

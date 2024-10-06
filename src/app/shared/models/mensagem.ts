export interface Mensagem {
    id: number;
    de: string;
    para: string;
    assunto: string;
    texto: string;
    lido: boolean;
    data: Date;
    tipo: string;
}

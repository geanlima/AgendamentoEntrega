export interface Venda {
    rca_order_id: number;
    date: string;
    subsidiary: string;
    id_user: number;
    client_code: number;
    business_name: string;
    fantasy_name: string;
    type_sale: string;
    description_type_sale: string;
    status: string;
    billing_code_order: string;
    payment_plan_code_order: string;
    payment_situation_erp: string;
    order_number_erp: number;
    total_order_amount: number;
    observation_return: string;
    date_delivery: string;
    progresso: number;
    paginator: number;
    log_resultado: string;
}

export interface VendaCompleta {
    codigo_pedido_rca: number;
    codigo_pedido: number;
    codigo_rca: number;
    nome_rca: string;
    codigo_cliente: number;
    fantasia_cliente: string;
    razao_social: string;
    cnpj_cpf_cliente: string;
    data_hora_abertura_pedido?: Date;
    data_hora_fechamento_pedido?: Date;
    numero_pedido_cliente: string;
    data_entrega_pedido: string;
    codigo_unidade_pedido: string;
    codigo_unidade_nf_pedido: string;
    codigo_unidade_retirada_pedido: string;
    valor_frete_pedido: number;
    codigo_cobranca_pedido: string;
    codigo_plan_pagamento_pedido: number;
    condicao_venda_pedido: string;
    observacao_pedido: string;
    observacao_entrega_pedido: string;
    frete_despacho_pedido: string;
    frete_rede_despacho_pedido: string;
    codigo_fornecedor_frete_pedido: string;
    prazo1_pedido: number;
    prazo2_pedido: number;
    prazo3_pedido: number;
    prazo4_pedido: number;
    prazo5_pedido: number;
    prazo6_pedido: number;
    prazo7_pedido: number;
    prazo8_pedido: number;
    prazo9_pedido: number;
    prazo10_pedido: number;
    prazo11_pedido: number;
    prazo12_pedido: number;
    origem_pedido: string;
    numero_pedido_comprador: string;
    posicao_atual_pedido: string;
    saldo_atual_rca: number;
    tipo_prioridade_entrega_pedido: string;
    perc_desc_abatimento_pedido: number;
    custo_bonificacao_pedido: string;
    cod_fornec_bonificacao_pedido: string;
    codigo_bonificao_pedido: string;
    agrupamento_pedido: string;
    codigo_endereco_entrega_pedido: number;
    orcamento_pedido: string;
    valor_desconto_abatimento_pedido: number;
    valor_entrada_pedido: number;
    status_pedido: string;
    total_itens_pedido: number;
    total_pedido: number;
    total_pedido_com_imposto: number;
    observacao_retorno: string;
    saldo_verba: number;
    quebra_pedido_frete: string;
    percentual_frete_outra_filial: number;
    codigo_filial_pedido_frete: string;
    codigo_produto_pedido_frete: string;
    preco_produto_pedido_frete: number;
    codigo_pedido_rca_pedido_frete: number;
    cidade_cliente: string;
    tipo_emissao: number;
    quebra_pedido_pre_venda: string;
    codigo_pedido_rca_pedido_pre_venda: string;
    codigo_filial_pedido_pre_venda: string;
    retorno_numero_pedido_erp: number;
    retorno_motivo_bloqueio: string;
    retorno_valor_pedido: number;
    retorno_valor_atendido: number;
    numero_pedido_venda: string;
    data_emissao_mapa?: Date;
    numero_pedido_erp_origional: number;
    comissao: number;
    peso: number;
    gerou_brinde: string;
    codigo_motorista: string;
    nome_motorista: string;
    celular_motorista: string;
    data_cadastro?: Date;
    status_processamento: string;
    data_processamento?: Date;
    mensagem_processamento: string;
    nome_arquivo_remessa: string;
    id_usuario: number;
    endereco_cliente: string;
    itens: ItenVenda[];
}

export interface ItenVenda {
    codigo_pedido_rca: number;
    codigo_rca: number;
    data_hora_abertura_pedido?: Date;
    item: number;
    codigo_produto?: number;
    descricao_produto?: string;
    quantidade: number;
    preco_venda_original: number;
    preco_venda: number;
    codigo_barras: string;
    quantidade_faturada: number;
    bonificacao: string;
    codigo_combo: number;
    corte: string;
    percentual_desconto: number;
    percnetual_desconto_boleto: number;
    sugestao: string;
    codigo_pedido: number;
    preco_venda_desconto: number;
    valor_total: number;
    valor_total_com_imposto: number;
    codigo_desconto3306: string;
    descricao_desconto3306: string;
    codigo_produto_principal: string;
    observacao_retorno: string;
    codigo_unidade_retirada: string;
    tipo_entrega: string;
    codigo_desconto561: string;
    diferenca_preco: number;
    saldo_verba: number;
    base_cred_deb_rca_descont561: string;
    aplica_automatico_desconto561: string;
    percentual_desconto561: number;
    codigo_auxiliar_embalagem: string;
    quantidade_unitaria_embalagem: number;
    utiliza_venda_por_embalagem: string;
    tipo_carga_produto: string;
    exibe_combo_embalagem: string;
    item_negociado: string;
    unidade_venda?: string;
    tipo_estoque_produto: string;
    codigo_regiao: number;
    percentual_acrescimo: number;
    comissao: number;
    peso: number;
    valor_st: number;
    preco_st: number;
    valor_total_com_st: number;
    numero_carregamento: number;
    percentual_base_red: number;
    percentual_icm: number;
    data_validade_campanha_shelf?: Date;
    preco_campanha_shelf: number;
    codigo_campanha_shelf: string;
    unidade_frios: string;
    imgProduto: string;
}

export interface TipoVendaUsuario {
    id: number;
    tipo: string;
}

export interface TipoCobranca {
    codigo_cobranca: string;
    nome_cobranca: string;
    nivel_venda_cobranca: number;
    aceita_cartao_cobranca: string;
    aceita_boleto_cobranca: string;
    valor_minimo_cobranca: number;
    codigo_unidade: string;
    usa_tabela_especial: string;
}

export interface Filial {
    codigo_unidade: string
    razao_social_unidade: string
    cpnj_unidade: string
    inscricao_estadual_unidade: string
    endereco_unidade: string
    bairro_unidade: string
    cidade_unidade: string
    uf_unidade: string
    cep_unidade: string
    telefone_unidade: string
    fax_unidade: string
    cod_cli_unidade: string
    usa_wms_unidade: string
    logo_empresa: string
}

export interface PlanoPagamento {
    codigo_plano_pagamento: number;
    descricao_plano_pagamento: string;
    numero_dias_plano_pagamento: number;
    data_vencimento1_plano_pagamento?: Date;
    data_vencimento2_plano_pagamento?: Date;
    data_vencimento3_plano_pagamento?: Date;
    prazo1_plano_pagamento: number;
    prazo2_plano_pagamento: number;
    prazo3_plano_pagamento: number;
    prazo4_plano_pagamento: number;
    prazo5_plano_pagamento: number;
    prazo6_plano_pagamento: number;
    prazo7_plano_pagamento: number;
    prazo8_plano_pagamento: number;
    prazo9_plano_pagamento: number;
    prazo10_plano_pagamento: number;
    prazo11_plano_pagamento: number;
    prazo12_plano_pagamento: number;
    valor_minimo_plano_pagamento: number;
    codigo_tabela_preco: number;
    tipo_restricao_plano_pagamento: string;
    codigo_restricao_plano_pagamento: number;
    tipo_venda_plano_pagamento: string;
    margem_minima_plano_pagamento: string;
    acrescimo_desconto_maximo: number;
    tipo_prazo_plano_pagamento: string;
    codigo_unidade: string;
    tipo_entrada_plano_pagamento: number;
    venda_boleto_plano_pagamento: string;
    forma_parcela_plano_pagamento: string;
    valor_min_parcela_plano_pagamento: number;
    dias_min_parcela_plano_pagamento: number;
    dias_max_parcela_plano_pagamento: number;
    qtd_parcela_plano_pagamento: number;
    qtd_minima_de_itens_plano_pagamento: number;
    usaplanofv: string;
}

export interface Endereco {
    codigo_endereco: number;
    endereco_entrega_cliente: string;
    numero_entrega_cliente: string;
    bairro_entrega_cliente: string;
    cidade_entrega_cliente: string;
    uf_entrega_cliente: string;
    cep_entrega_cliente: string;
    telefone_entrega_cliente: string;
    observacao_entrega_cliente: string;
}

// export interface VendaInserida {
//     CodigoPedidoRCA: number;
//     CodigoRCA: number;
//     DataHoraAbertura: Date;
//     //Licenca: string;
// }

export interface VendaInseridaNovo {
    CodigoPedidoRCA: number;
    CodigoRca: number;
    DataHoraAbertura: Date;
    Licenca: string;
}

export interface IntegracaoPedido{
    CodigoPedido: number;
}
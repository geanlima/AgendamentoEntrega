export interface Produto {
  codigo_produto: number;
  descricao_produto: string;
  embalagem_produto: string;
  unidade_venda: string;
  estoque_disponivel: number;
  dados_comerciais: DadoComerciais;
  mix_cliente: string;
  isSelected: boolean;
  codigo_departamento: string;
  codigo_secao: string;
  codigo_categoria: string;
  codigo_subcategoria: string;
  codigo_marca: string;
  codigo_fornecedor: string;
  possui_campanha_shelf: string;
  imgProduto: string;
  marca_produto: string;
  quantidade_embalagem_venda: number;

}

export interface ProdutoDetalhe extends Produto {
  codigo_produto: number;
  codigo_produto_principal: number;
  descricao_produto: string;
  embalagem_produto: string;
  unidade_venda: string;
  peso_embalagem_venda: number;
  codigo_departamento: string;
  codigo_secao: string;
  codigo_categoria: string;
  codigo_subcategoria: string;
  codigo_marca: string;
  qt_embalagem_venda: number;
  embalagem_compra: string;
  unidade_compra: string;
  qt_embalagem_compra: number;
  codigo_fornecedor: string;
  data_cadastro: string;
  codigo_ean: number;
  codigo_dun: number;
  referencia: string;
  codigo_distribuicao: string;
  comissao_vendedor_interno: number;
  comissao_representante: number;
  comissao_vendedor_externo: number;
  informacoes_tecnicas: string;
  caminho_foto_produto: string;
  aceita_venda_fracao: string;
  peso_variavel: string;
  ncm_produto: string;
  tipo_estoque_produto: string;
  tipo_estoque: string;
  aceita_venda_fracionada: string;
  checa_multiplo_venda_bnf: string;
  multiplo_produto: number;
  qt_minima_preco_atacado: number;
  estoque_disponivel: number;
  dados_comerciais: DadoComerciais;
  dados_historicos: DadosHistoricos;
  produtoGrafico: { [key: string]: number };
  possui_campanha_shelf: string;
  imgProduto: string;
}

export interface DadoComerciais {
  precoTabela: number;
  precoSemImposto: number;
  precoMaximo: number;
  precoMinimo: number;
  percentualDescontoFlexivel: number;
  percentualDescontoAutomatico: number;
  percentualAcrescimoMaximo: number;
}

export interface DadosHistoricos {
  DataUltCompra: string;
  QTDUltimaCompra: number;
  PrecoUltimaCompra: number;
  QuantidadeMedia: number;
  percentualParticipacao: number;
}
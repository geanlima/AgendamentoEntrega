import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AtendimentoSacComponent, CadastroOportunidadeComponent, DevolucoesPopupComponent, HistoricoCobrancaComponent, HistoricoPedidosComponent, ItemHistoricoPopupComponent, MixIdealPopupComponent, TitulosPopupComponent } from '@core/components';
import { environment } from '@env';
import { TypeToast } from '@shared/enums';
import { Usuario } from '@shared/models';
import { ClienteService, DialogService, NotificationService, OportunidadeService, StorageService } from '@shared/services';
import { ChartComponent } from 'ng-apexcharts';
import { Subscription } from 'rxjs';
import { ChartOptions } from 'src/app/shared/models/chartOptions';
import { HistoricoPedidos } from 'src/app/shared/models/historico-pedidos';
import { Oportunidade } from 'src/app/shared/models/oportunidade';
import { CardDevolucao, PainelAtendimento as PainelAtendimento } from 'src/app/shared/models/painel-atendimento';
import { DialogConfirmationService } from 'src/app/shared/services/dialog-confirmation.service';

@Component({
  selector: 'app-painel-atendimentos',
  templateUrl: './painel-atendimentos.component.html',
  styleUrls: ['./painel-atendimentos.component.scss']
})
export class PainelAtendimentosComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild("chart") chart!: ChartComponent;
  @ViewChild(HistoricoPedidosComponent) historicoPedidosComponent!: HistoricoPedidosComponent;
  @ViewChild(AtendimentoSacComponent) atendimentoSacComponent!: AtendimentoSacComponent;
  @ViewChild(HistoricoCobrancaComponent) historicoCobrancaComponent!: HistoricoCobrancaComponent;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public mostrarPaginator: boolean = false;

  public chartOptions: Partial<ChartOptions> | any;

  public displayedColumns = ['descricaoCondVenda', 'numeroPedido', 'valorTotal', 'quantidadeitens'];
  public dataSource!: MatTableDataSource<HistoricoPedidos>;
  public dataSourceAtendimento!: MatTableDataSource<HistoricoPedidos>;
  public page: number = 0;
  public pageSize: number = 5;

  public idCliente: number = 0;
  public cnpj_cpf_cliente: string = '';
  public fantasia_cliente: string = '';
  public razao_social: string = '';
  public endereco_cliente: string = '';
  public limiteCredito: number = 0;
  public valorCredito: number = 0;
  public saldoDisponivel: number = 0;
  public dtPrimeiraCompra: Date = new Date();
  public dtUltimaCompra: Date = new Date();
  public tempoRelacionamento: string = '';
  public ticketMedio: number = 0;
  public maiorCompra: number = 0;
  public menorCompra: number = 0;
  public titulosEmAberto: number = 0;
  public titulosVencidos: number = 0;
  public prazoMedioPagamento: string = "";
  public mediaAtraso: string = "";
  public qtdDevolucoes: string = "";
  public valorTotalDevolvido: string = "";

  public mixIdeal: string = "";

  public painelatendimento!: PainelAtendimento;
  public historicopedidos: HistoricoPedidos[] = [];
  public oportunidades: Oportunidade[] = [];

  private _subs: Subscription[] = [];
  private usuario: Usuario | undefined;
  private regiaoCliente: number = 0;

  constructor(
    private _notificationService: NotificationService,
    private _router: Router,
    private _dialog: DialogService,
    private _storageService: StorageService,
    private _clienteService: ClienteService,
    private _oportunidadeService: OportunidadeService,
    private _dialogConfirmationService: DialogConfirmationService
  ) {
    this.chartOptions = this.getChartOptions(this.preencherVendasVazia());

    this.painelatendimento = this._storageService.getPainelAtendimento();

    this.idCliente = this.painelatendimento.codigo_cliente;

    this.usuario = this._storageService.getUsuario();

    const subs = this._clienteService.getClienteById(this.idCliente).subscribe((clienteCompleto) => {
      this._storageService.saveClienteCompleto(clienteCompleto);
      this.regiaoCliente = clienteCompleto.regiao_cliente;
    });

    this._subs.push(subs);

  }
  ngOnInit(): void {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.bindPainelAtendimento();
      this.loadOportunidade();
    });
  }

  ngOnDestroy(): void {
    this._subs.forEach((sub: Subscription) => sub.unsubscribe());
  }

  onResumoClick(): void {

    this._notificationService.showToast(
      {
        message: "Painel Resumo Clicado.",
        typeToast: TypeToast.SUCCESS
      }
    );

  }

  onTitulosEmAbertoClick(): void {

    this.onCallPopTitulos(true);

  }

  onTitulosVencidosClick(): void {

    this.onCallPopTitulos(false);

  }

  onMixIdealClick(): void {
    const modalMixIdeal = this._dialog.show(MixIdealPopupComponent,
      { mixidealitens: this.painelatendimento.mixIdealItens },
      ['override-modal-titulos']
    );

    modalMixIdeal.componentInstance.closeModal.subscribe(() => {
      this._dialog.close(modalMixIdeal);
    });
  }

  onDevolucoesClick(): void {
    const devolucoesPopup = this._dialog.show(DevolucoesPopupComponent,
      { devolucoes: this.painelatendimento.devolucoes },
      ['override-modal-titulos'],
      true,
      true,
      '760px',
      '1300px'
    );

    devolucoesPopup.componentInstance.closeModal.subscribe(() => {
      this._dialog.close(devolucoesPopup);
    });
  }

  onFinalizarAtendimento(): void {
    this._router.navigate(['/home/dashboard']);
  }

  onIniciarVenda(): void {
    const idCliente = this.idCliente;
    this._router.navigate(['/home/atendimento-novo', idCliente, 'N']);
  }

  getTextoOportunidadeCadastrada(): string {
    return this.oportunidades.length == 1 ? 'Oportunidade Cadastrada' : 'Oportunidades Cadastradas';
  }

  onOportunidades(): void {

    const itemPopup = this._dialog.show(CadastroOportunidadeComponent,
      {
        codigoCliente: this.idCliente,
        codigoRca: this.usuario!.rca_code,
        codigoUnidade: environment.unidade,
        regiaoCliente: this.regiaoCliente,
      },
      ['override-modal-titulos'],
      true,
      true,
      '400px',
      '575px',
    );

    itemPopup.componentInstance.closeModal.subscribe(() => {
      this.loadOportunidade();
      this._dialog.close(itemPopup);
    });
  }

  deleteOrtunidade(oportunidade: Oportunidade): void {
    const respostaLogout = this._dialogConfirmationService.openDialog({
      header: 'Atenção',
      message: 'Deseja realmente excluir esta oportunidade?',
      txtAct: 'Sim',
      txtCancel: 'Não'
    });

    respostaLogout.subscribe((resposta: boolean) => {
      if (!resposta) return;
      oportunidade.status = 'I';

      const subs = this._oportunidadeService.updateOportunidade(oportunidade).subscribe((oportunidades) => {
        this.loadOportunidade();
      });

      this._subs.push(subs);

    });
  }

  obterNomeTipo(tipo: string): string {
    switch (tipo.toUpperCase()) {
      case 'PRODUTO':
        return 'Produto';
        break;
      case 'PROMOTOR':
        return 'Serviço de Merchandising';
        break;
      case 'CAMPANHA':
        return 'Campanha';
        break;
      default:
        return 'Não Definido'
        break;
    }
  }

  onVerItens(numeropedido: number): void {
    const pedidoIten = this.painelatendimento.pedidos.find(p => p.numeroPedido === numeropedido);

    const itemPopup = this._dialog.show(ItemHistoricoPopupComponent,
      {
        pedido: pedidoIten,
        painelatendimento: this.painelatendimento
      },
      ['override-modal-titulos'],
      true,
      true,
      '650px',
      '1200px',
    );

    itemPopup.componentInstance.closeModal.subscribe(() => {
      this._dialog.close(itemPopup);
    });
  }

  onVerNotas(numeropedido: number): void {
    this._notificationService.showToast(
      {
        message: "Ver Notas ainda não disponível.",
        typeToast: TypeToast.SUCCESS
      }
    );
  }

  getIconSituacao(situacao: string): string {
    switch (situacao) {
      case 'Liberado':
        return 'done';
      case 'Em Carregamento':
        return 'local_shipping';
      case 'Bloqueado':
        return 'lock';
      case 'Faturado':
        return 'article';
      case 'Cancelado':
        return 'delete';
      default:
        return 'do_not_disturb';
    }
  }

  private loadOportunidade(): void {

    const subs = this._oportunidadeService.getAllOportunidades(this.idCliente, +environment.unidade, +this.usuario!.rca_code).subscribe((oportunidades) => {

      this.oportunidades = oportunidades;

    });

    this._subs.push(subs);
  }

  private preencherVendasVazia(): any {
    return {
      valor_venda_01: 0,
      valor_venda_02: 0,
      valor_venda_03: 0,
      valor_venda_04: 0,
      valor_venda_05: 0,
      valor_venda_06: 0,
      valor_venda_07: 0,
      valor_venda_08: 0,
      valor_venda_09: 0,
      valor_venda_10: 0,
      valor_venda_11: 0,
      valor_venda_12: 0,
      valor_venda_total: 0
    };
  }

  private retornaPeriodoLiteral(meses: number): string {

    if (meses === 0) {
      return 'Menos de um mês';
    }


    const anos = Math.floor(meses / 12);
    const mesesRestantes = meses % 12;

    let periodoLiteral = "";

    if (anos > 0) {
      periodoLiteral += anos === 1 ? "1 ano" : `${anos} anos`;
    }

    if (mesesRestantes > 0) {
      if (anos > 0) {
        periodoLiteral += " e ";
      }
      periodoLiteral += mesesRestantes === 1 ? "1 mês" : `${mesesRestantes} meses`;
    }

    return periodoLiteral;
  }

  private bindPainelAtendimento(): void {
    this.idCliente = this.painelatendimento.codigo_cliente;
    this.cnpj_cpf_cliente = this.painelatendimento.cnpj;
    this.fantasia_cliente = this.painelatendimento.fantasia;
    this.razao_social = this.painelatendimento.razao_social;
    this.endereco_cliente = this.painelatendimento.endereco_entrega;
    this.limiteCredito = this.painelatendimento.limite_credito;
    this.valorCredito = this.painelatendimento.limite_credito;
    this.saldoDisponivel = this.painelatendimento.saldo_disponivel;
    this.dtPrimeiraCompra = this.painelatendimento.data_primeira_compra;
    this.dtUltimaCompra = this.painelatendimento.data_ultima_compra;
    this.tempoRelacionamento = this.retornaPeriodoLiteral(this.painelatendimento.tempo_relacionamento);
    this.ticketMedio = this.painelatendimento.ticket_medio;
    this.maiorCompra = this.painelatendimento.maior_compra;
    this.menorCompra = this.painelatendimento.menor_compra;
    this.titulosEmAberto = this.painelatendimento.titulos_a_vencer;
    this.titulosVencidos = this.painelatendimento.titulos_vencidos;
    this.prazoMedioPagamento = this.painelatendimento.prazo_medio_pagamento > 1 ? this.painelatendimento.prazo_medio_pagamento + ' dias' : this.painelatendimento.prazo_medio_pagamento + ' dia';
    this.mediaAtraso = this.painelatendimento.media_atraso > 1 ? this.painelatendimento.media_atraso + ' dias' : this.painelatendimento.media_atraso + ' dia';
    this.qtdDevolucoes = this.getQtdDevolucoes(this.painelatendimento.cardDevolucao).toString();
    this.valorTotalDevolvido = this.formatarParaBRL(this.getValorDevolucoes(this.painelatendimento.cardDevolucao));

    if (this.painelatendimento.mix_ideal) {
      this.mixIdeal = this.painelatendimento.mix_ideal.toString();
    }
    else {
      this.mixIdeal = '0';
    }

    if (this.painelatendimento.pedidos) {
      for (let index = 0; index < this.painelatendimento.pedidos.length; index++) {
        let historicoPedido = this.painelatendimento.pedidos[index];
        historicoPedido.quantidadeitens = historicoPedido.itens.length;
      }
    }

    this.setDataSourceHistorico(this.painelatendimento);
    this.setDatasourceSAC(this.idCliente);
    this.setDatasourceHistoricoCobranca(this.idCliente);

    if (this.painelatendimento.vendas) {
      this.chartOptions = this.getChartOptions(this.painelatendimento.vendas);
    }
  }

  private getQtdDevolucoes(devolucoes: CardDevolucao[]): number {
    let qtdReturno = 0;

    if (devolucoes && devolucoes.length > 0) {
      for (let index = 0; index < devolucoes.length; index++) {
        const dev = devolucoes[index];
        qtdReturno = qtdReturno + dev.qtNf;
      }
    }

    return qtdReturno;
  }

  private getValorDevolucoes(devolucoes: CardDevolucao[]): number {
    let valorReturno = 0;

    if (devolucoes && devolucoes.length > 0) {
      for (let index = 0; index < devolucoes.length; index++) {
        const dev = devolucoes[index];
        valorReturno = valorReturno + dev.vlTotal;
      }
    }

    return valorReturno;
  }

  private formatarParaBRL(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  private setDataSourceHistorico(painelatendimento: PainelAtendimento) {
    this.historicoPedidosComponent.setPainelAtendimentoHistorico(painelatendimento);
    this.dataSource = new MatTableDataSource(painelatendimento.pedidos);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  private setDatasourceSAC(idCliente: number): void {
    this.atendimentoSacComponent.setClientSAC(idCliente);
  }

  private setDatasourceHistoricoCobranca(idCliente: number): void {
    this.historicoCobrancaComponent.setHistoricoCobrancaCliente(idCliente);
  }


  private onCallPopTitulos(aberto: boolean): void {
    const modalTitulos = this._dialog.show(TitulosPopupComponent,
      {
        titulos: this.painelatendimento.titulos,
        tituloAberto: aberto
      },
      ['override-modal-titulos'],
      true,
      true,
      '760px',
      '1200px'
    );

    modalTitulos.componentInstance.closeModal.subscribe(() => {
      this._dialog.close(modalTitulos);
    });
  }

  private getChartOptions(input: Record<string, number>): Partial<ChartOptions> | any {
    const valorVendas: number[] = [];

    for (let i = 1; i <= 12; i++) {
      const valorKey = `valor_venda_${i.toString().padStart(2, '0')}`;
      const valor = input[valorKey];
      valorVendas.push(valor);
    }

    const months = this.getLastSixMonths();

    const values = this.getValueLastSixMonths(valorVendas);

    const data: Partial<ChartOptions> | any = {
      series: [
        {
          name: "Valor",
          data: values,
        },
      ],
      chart: {
        height: 180,
        type: "bar",
      },
      title: {
        text: "Compras nos últimos 6 meses",
      },
      yaxis: {
        labels: {
          show: false,
        },
        decimalsInFloat: 2,
      },
      xaxis: {
        categories: months,
      },
    };

    return data;
  }

  private getLastSixMonths(): string[] {

    const months = [
      'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
    ];

    const today = new Date();
    const currentMonth = today.getMonth();
    const lastSixMonths = [];

    for (let i = currentMonth - 5; i <= currentMonth; i++) {
      const monthIndex = (i < 0 ? 12 + i : i);
      const month = months[monthIndex];
      lastSixMonths.push(month);
    }

    return lastSixMonths;
  }

  private getValueLastSixMonths(valorVendas: number[]): number[] {

    const today = new Date();
    const currentMonth = today.getMonth();

    const valorVendasReturn: number[] = [];

    for (let i = currentMonth - 5; i <= currentMonth; i++) {
      const monthIndex = (i < 0 ? 12 + i : i);
      const valor = valorVendas[monthIndex];
      const valorDecimal = +valor.toFixed(2);
      valorVendasReturn.push(valorDecimal);
    }

    return valorVendasReturn;
  }


}

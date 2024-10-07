import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ProdutoPopupComponent } from '@core/components';
import { ProgressComponent } from '@shared/components';
import { TypeToast } from '@shared/enums';
import { ClienteCompleto, Parametro, Produto, Usuario } from '@shared/models';
import { ClienteService, DialogService, NotificationService, ParametroService, StorageService } from '@shared/services';
import { catchError, finalize, Observable, of, Subscription, tap, throwError } from 'rxjs';
import { TransportadoraPopupComponent } from 'src/app/core/components/transportadora-popup/transportadora-popup.component';
import { OrigemPedido, TipoEntrega } from 'src/app/shared/models/pedido';
import { Transportadora } from 'src/app/shared/models/transportadora';
import { Endereco, Filial, ItenVenda, PlanoPagamento, TipoVendaUsuario, TipoCobranca, VendaCompleta, VendaInseridaNovo } from 'src/app/shared/models/venda';
import { DialogConfirmationService } from 'src/app/shared/services/dialog-confirmation.service';
import { PlanoPagamentoService } from 'src/app/shared/services/planopagamento.service';
import { VendaService } from 'src/app/shared/services/venda.service';
import { TipoEntregaPopupComponent } from '@core/components';

@Component({
  selector: 'app-atendimentos',
  templateUrl: './atendimentos.component.html',
  styleUrls: ['./atendimentos.component.scss']
})
export class AtendimentosComponent implements OnInit, AfterViewInit, OnDestroy {

  private readonly BASE64_STRING_PREFIX = 'data:image/png;base64,';
  private noImage = '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';

  
  @ViewChild('atendimentoFormNgForm') atendimentoFormNgForm?: NgForm;
  @ViewChild('dadosAdicionaisFormNgForm') dadosAdicionaisFormNgForm?: NgForm;
  @ViewChild('dadosTransportadoraFormNgForm') dadosTransportadoraFormNgForm?: NgForm;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public isReadOnly: boolean = false;

  public displayedColumns = ['imgProduto', 'codigo_produto', 'descricao_produto', 'preco_venda', 'quantidade', 'unidade_venda', 'valor_total', 'action'];
  public dataSource!: MatTableDataSource<ItenVenda>;
  public page: number = 0;
  public pageSize: number = 8;

  public tipoentregaselected: string = "RI";
  public tipovenda: TipoVendaUsuario[] = [];
  public tipoentrega$!: Observable<TipoEntrega[]>;
  public origempedido$!: Observable<OrigemPedido[]>;
  public tipocobranca: TipoCobranca[] = [];
  public planopagamento: PlanoPagamento[] = [];
  public planoPagamentoExibir: PlanoPagamento[] = [];
  public filiais: Filial[] = [];
  public enderecos: Endereco[] = [];

  public idCliente: number;
  public idVenda: number;
  public usuario: Usuario;
  public parametros: Parametro[];

  public vendaCompleta!: VendaCompleta;
  public clienteCompleto!: ClienteCompleto;

  public atendimentoForm!: FormGroup;
  public dadosAdicionaisForm!: FormGroup;
  public dadosTransportadoraForm!: FormGroup;

  public descAcaoAtendimento: string | undefined;
  public descAcaoAtendimentoRota: string;

  public modoFinalizarPedido: boolean = false;
  public exibirNumeroPedidoVenda: boolean = false;

  //Campos a serem iniciados
  //Venda
  public cnpj_cpf_cliente: string = '';
  public data_hora_abertura_pedido: Date | undefined;
  public status_processamento: string = '';
  public razao_social: string = '';
  public total_pedido: number = 0;

  //Cliente

  public saldo_limite_cliente: number = 0;
  public fantasia_cliente: string = '';
  public debito_cliente: number = 0;
  public credito_pendente_cliente: number = 0;

  //Totais

  public saldoDisponivel: number = 0;
  public saldoPedido: number = 0;
  public saldoFuturo: number = 0;
  public valorST: number = 0;
  public valorIPI: number = 0;
  public valorFECP: number = 0;

  public valorImpostos: number = 0;
  public valorDesconto: number = 0;
  public valorComissao: number = 0;
  public valorTotal: number = 0;

  //Date Picker
  minDate: Date = new Date();
  maxDate: Date = new Date();
  daysFromTomorrow: number = 7;

  private _subs: Subscription[] = [];

  private readonly MAX_SIZE_OBSERVACAO_PEDIDO = 100;
  private readonly MAX_SIZE_OBSERVACAO_ENTREGA = 300;
  private retornaPedidos = false;

  constructor(
    private _activatedRouter: ActivatedRoute,
    private _http: HttpClient,
    private _formBuilder: FormBuilder,
    private _vendaService: VendaService,
    private _parametroService: ParametroService,
    private _clienteService: ClienteService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _storageService: StorageService,
    private _dialogService: DialogService,
    private _notificationService: NotificationService,
    private _planoPagamentoService: PlanoPagamentoService,
    private _dialogConfirmationService: DialogConfirmationService
  ) {

    this.usuario = this._storageService.getUsuario();
    this.parametros = this._storageService.getParametros();

    this.setTelaFinalizarPedido(false);

    this.CreateFormPrincipal(false);
    this.CreateFormAdicionais(false);

    this.tipoentrega$ = this._http.get<TipoEntrega[]>('./../assets/data/tipoentrega.json');
    this.origempedido$ = this._http.get<OrigemPedido[]>('./../assets/data/origempedido.json');

    const novoAtendimentoRoute = '/home/atendimento-novo';

    const paramRetornaPedidos = this._activatedRouter.snapshot.paramMap.get('backtodash');

    this.retornaPedidos = paramRetornaPedidos === 'S';

    if (this._router.url.includes(novoAtendimentoRoute)) {

      const paramIdClient = this._activatedRouter.snapshot.paramMap.get('idcliente');

      this.idCliente = paramIdClient ? +paramIdClient : 0;

      this.idVenda = 0;

      this.descAcaoAtendimentoRota = 'Novo Atendimento';

      this.InicializaVendaCompleta();

    } else {

      const paramIdVenda = this._activatedRouter.snapshot.paramMap.get('idvenda');

      this.idVenda = paramIdVenda ? +paramIdVenda : 0;

      this.idCliente = 0;

      this.descAcaoAtendimentoRota = 'Editar Atendimento';
      
      this.loadVendaCompleta();
    }
  }

  InicializaVendaCompleta() {
    try {
      
      this.vendaCompleta = this.criarVendaCompleta();

      this.status_processamento = this.getStatusPedido(this.vendaCompleta.status_processamento);
      this.data_hora_abertura_pedido = this.vendaCompleta.data_hora_abertura_pedido;

      this.loadCliente(true);
      this.loadFiliais(true);

      this.setaOpcoesPadraoForm();

      this._storageService.saveVendaCompleta(this.vendaCompleta);

    } catch (error) {

      this._notificationService.showToast(
        {
          message: "Ocorreu um erro ao Iniciar Venda.",
          typeToast: TypeToast.ERROR
        }
      );
    }
  }

  onFilialChange(valorFilial: string) {
    this.vendaCompleta.codigo_unidade_pedido = valorFilial;

    this.verificaExibirNumeroPedidoVenda();
    this.setaLimiteDataEntrega();
  }

  onCobrancaChange(codigoCobranca: string) {

    if (!this.tipocobranca || this.tipocobranca.length <= 0) return;
    if (!this.planopagamento || this.planopagamento.length <= 0) return;

    const cobranca = this.tipocobranca.find(e => e.codigo_cobranca == codigoCobranca);

    if (!cobranca) return;

    if (cobranca) {
      if (cobranca.aceita_boleto_cobranca && cobranca.aceita_boleto_cobranca == 'S') {
        // Filtra os planos que só tem venda por boleto
        this.planoPagamentoExibir = this.planopagamento.filter(ite => ite.venda_boleto_plano_pagamento == 'S');
      } else {
        // Retira qualquer filtro
        this.planoPagamentoExibir = this.planopagamento;
      }

      const codigoPlanoSelecionado = this.atendimentoForm.get('codigo_plan_pagamento_pedido')?.value;

      // Verifica se o plano já selecionado no pedio faz parte dos planos filtrados
      const planoExiste = this.verificarPlanoPagamentoExisteLista(codigoPlanoSelecionado, this.planoPagamentoExibir);
      if (planoExiste && planoExiste.codigo_plano_pagamento > 0) {
        this.atendimentoForm.patchValue({
          codigo_plan_pagamento_pedido: planoExiste.codigo_plano_pagamento,
        });

        return;
      }

      // Tenta selecionar o primeiro
      if (this.planoPagamentoExibir && this.planoPagamentoExibir.length > 0) {
        this.atendimentoForm.patchValue({
          codigo_plan_pagamento_pedido: this.planoPagamentoExibir[0].codigo_plano_pagamento,
        });

        return;
      }
    }

  }

  onTipoVendaChange(valorTipoVenda: string) {
    this.vendaCompleta.condicao_venda_pedido = valorTipoVenda;
    this.tipoentregaselected = "RI"; 
    
    if (valorTipoVenda === '5') {
      this.parametros.forEach((params) => {
        if (params.nome_parametro === 'CODIGO_COBRANCA_PADRAO_BONIFICACAO') {
          this.atendimentoForm.controls['codigo_cobranca_pedido'].disable();
          this.atendimentoForm.controls['codigo_cobranca_pedido'].setValue(params.valor_parametro);
        }

        if (params.nome_parametro === 'CODIGO_PLANO_PADRAO_BONIFICACAO') {
          this.atendimentoForm.controls['codigo_plan_pagamento_pedido'].disable();
          this.atendimentoForm.controls['codigo_plan_pagamento_pedido'].setValue(parseInt(params.valor_parametro));
        }
      });
    } else if (valorTipoVenda == '1') {
      this.atendimentoForm.controls['codigo_cobranca_pedido'].enable();
      this.atendimentoForm.controls['codigo_cobranca_pedido'].setValue(this.clienteCompleto.codigo_cobranca_cliente);
      this.atendimentoForm.controls['codigo_plan_pagamento_pedido'].enable();
      this.atendimentoForm.controls['codigo_plan_pagamento_pedido'].setValue(this.clienteCompleto.codigo_plano_pagamento_cliente);
    }
    else if (valorTipoVenda == '7')
    {
      const modal = this._dialogService.show(TipoEntregaPopupComponent, {});

      modal.componentInstance.closeModal.subscribe((data: any) => {
        this.tipoentregaselected = data;
        this._dialogService.close(modal);
    });
    }

    this.verificaExibirNumeroPedidoVenda();
  }

  private verificaExibirNumeroPedidoVenda(): void {
    // Tipo Venda igual a Bonificação e filial selecionada busca se parametro = 'S'
    if (this.vendaCompleta.codigo_unidade_pedido !== '' && this.vendaCompleta.condicao_venda_pedido === '5') {
      const progress = this._dialogService.showProgress(ProgressComponent);

      const subs = this._parametroService.getParametro(+this.vendaCompleta.codigo_unidade_pedido, "EXIGE_NUMERO_PEDIDO_TV1_PARA_BNF").subscribe((parametro) => {

        if (parametro) {
          this.exibirNumeroPedidoVenda = parametro.valor_parametro !== 'S';
        }
        this._dialogService.close(progress);
      });

      this._subs.push(subs);
    } else {
      this.exibirNumeroPedidoVenda = false;
    }
  }

  onAvancar(): void {
    this.setTelaFinalizarPedido(true);
  }

  onVoltar(): void {
    if (this.vendaCompleta.codigo_pedido_rca && this.vendaCompleta.codigo_pedido_rca > 0) {
      if (this.retornaPedidos) {
        this._router.navigate(['/home/pedidos']);
      }
      else {
        this._router.navigate(['/home/painel-atendimento']);
      }
      return;
    }

    const respostaLogout = this._dialogConfirmationService.openDialog({
      header: 'Atenção',
      message: 'Deseja realmente sair do pedido em andamento?',
      txtAct: 'Sim',
      txtCancel: 'Não'
    });

    respostaLogout.subscribe((resposta: boolean) => {
      if (!resposta) return;

      if (this.retornaPedidos) {
        this._router.navigate(['/home/dashboard']);
      }
      else {
        this._router.navigate(['/home/painel-atendimento']);
      }
    });
  }

  onRetornar(): void {
    this.setTelaFinalizarPedido(false);
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    this._subs.forEach((sub: Subscription) => sub.unsubscribe());
  }

  getIdVenda(): string {
    return this.idVenda == 0 ? '-' : this.idVenda.toString();
  }

  getStatusPedido(idstatus: string): string {
    switch (idstatus) {
      case 'A':
        return 'AGUARDANDO ENVIO'
      case 'P':
        return 'TRANSMITIDO'
      default:
        return '';
    }
  }

  setTelaFinalizarPedido(telaFinalizarPedido: boolean): void {
    this.modoFinalizarPedido = telaFinalizarPedido;
    this.descAcaoAtendimento = telaFinalizarPedido ? 'Finalizar Pedido' : 'Adicionar Itens';
  }

  getImage64(img: string): string {
    const img64 = img ? img : this.noImage;
    return `${this.BASE64_STRING_PREFIX}${img64}`;
  }


  private loadVendaCompleta(): void {
    if (this.idVenda == 0) { // Pedido novo

      this.vendaCompleta = this._storageService.getVendaCompleta();

      this.idCliente = this.vendaCompleta.codigo_cliente;

      this.CarregadDadosAdicionaisVenda();

      this.setaLimiteDataEntrega();
    }
    else { // Pedido Carregado

      let localStorageVenda = this._storageService.getVendaCompleta();
      if (localStorageVenda && localStorageVenda.codigo_pedido_rca) {
        this.vendaCompleta = localStorageVenda;

        this.CarregadDadosAdicionaisVenda();
      }    
      else {
        
        const subs = this._vendaService.getVendaById(this.idVenda).subscribe((vendaCompleta) => {

          this.vendaCompleta = vendaCompleta;

          this._storageService.saveVendaCompleta(this.vendaCompleta);

          this.CarregadDadosAdicionaisVenda();

          this.setaLimiteDataEntrega();
        });

        this._subs.push(subs);
      }

      this.tipoentregaselected = this._storageService.getVendaCompletaTipoEntrega();      
    }
  }

  private CarregadDadosAdicionaisVenda() {

    if (this.vendaCompleta) {
      this.isReadOnly = false;//this.getStatusPedido(this.vendaCompleta.status_processamento) === 'TRANSMITIDO';

      this.CreateFormPrincipal(this.isReadOnly);
      this.CreateFormAdicionais(this.isReadOnly);

      this.idCliente = this.vendaCompleta.codigo_cliente;
      this.data_hora_abertura_pedido = this.vendaCompleta.data_hora_abertura_pedido;
      this.status_processamento = this.getStatusPedido(this.vendaCompleta.status_processamento);
      this.total_pedido = this.vendaCompleta.total_pedido;

      this.loadCliente(false);
      this.loadFiliais(false);
      this.loadTipoVenda(false);
      this.loadTipoCobranca(false);
      this.loadPlanoPagamento(false);
      this.loadItensPedido();

      this.vendaCompleta.data_entrega_pedido = new Date(
        new Date(this.vendaCompleta.data_entrega_pedido).getFullYear(),
        new Date(this.vendaCompleta.data_entrega_pedido).getUTCMonth(),
        new Date(this.vendaCompleta.data_entrega_pedido).getUTCDate()
      ).toISOString();

      this.atendimentoForm.patchValue(this.vendaCompleta);

      if (this.vendaCompleta.codigo_plan_pagamento_pedido) {
        this.atendimentoForm.patchValue({
          codigo_plan_pagamento_pedido: +this.vendaCompleta.codigo_plan_pagamento_pedido,
        });
      }

      this.dadosAdicionaisForm.patchValue({
        observacao_pedido: this.vendaCompleta.observacao_pedido,
        observacao_entrega_pedido: this.vendaCompleta.observacao_entrega_pedido
      });
    }
  }

  private calculaTotais(): void {
    this.saldoPedido = 0;
    this.saldoFuturo = 0;
    this.valorST = 0;
    this.valorIPI = 0;
    this.valorFECP = 0;
    this.valorImpostos = 0;
    this.valorDesconto = 0;
    this.valorComissao = 0;
    this.valorTotal = 0;
    this.total_pedido = 0;

    this.vendaCompleta.itens.forEach(iten => {

      const tmpDesconto = iten.preco_venda_original - iten.preco_venda_desconto

      this.saldoPedido = this.saldoPedido + tmpDesconto;

      if (tmpDesconto > 0) {
        this.valorDesconto = this.valorDesconto + tmpDesconto;
      }

      this.valorST = this.valorST + iten.valor_st;

      this.valorComissao = this.valorComissao + iten.comissao;

      this.total_pedido = this.total_pedido + (iten.preco_venda * iten.quantidade);
    });

    this.saldoFuturo = this.saldoDisponivel - this.saldoPedido;

    this.valorImpostos = this.valorST + this.valorIPI + this.valorFECP;

    this.valorTotal = this.vendaCompleta.total_pedido + this.valorImpostos;
  }

  private carregaCliente(cliente: ClienteCompleto) {
    this.fantasia_cliente = this.clienteCompleto.fantasia_cliente;
    this.saldo_limite_cliente = this.clienteCompleto.saldo_limite_cliente;
    this.debito_cliente = this.clienteCompleto.debito_cliente;
    this.cnpj_cpf_cliente = this.clienteCompleto.cnpj_cliente;
    this.razao_social = this.clienteCompleto.razao_social_cliente;
    this.credito_pendente_cliente = this.clienteCompleto.credito_pendente_cliente;
  }

  private loadCliente(iniciarVenda: boolean): void {

    this.clienteCompleto = this._storageService.getClienteCompleto();
    if (this.clienteCompleto && this.clienteCompleto.codigo_cliente > 0) {
      this.carregaCliente(this.clienteCompleto);
      this.loadEndereco(iniciarVenda);
      //return;
    }

    const progress = this._dialogService.showProgress(ProgressComponent);
    const subs = this._clienteService.getClienteById(this.idCliente).subscribe((clienteCompleto) => {
      this.clienteCompleto = clienteCompleto;

      if (this.clienteCompleto) {
        this.carregaCliente(this.clienteCompleto);

        if (iniciarVenda) {
          //Dados de clientes que impactam venda
          // ANALISAR COM O ABÍLIO
          if (this.clienteCompleto.condvenda5 === 'S') {

            this.vendaCompleta.condicao_venda_pedido = "5";
          }
          if (this.clienteCompleto.condvenda1 === 'S') {

            this.vendaCompleta.condicao_venda_pedido = "1";
          }

          this.atendimentoForm.patchValue({
            condicao_venda_pedido: this.vendaCompleta.condicao_venda_pedido,
          });

          this.vendaCompleta.fantasia_cliente = this.clienteCompleto.fantasia_cliente;
          this.vendaCompleta.razao_social = this.clienteCompleto.razao_social_cliente;
          this.vendaCompleta.cnpj_cpf_cliente = this.clienteCompleto.cnpj_cliente;

          this.loadTipoVenda(true);
          this.loadTipoCobranca(true);
          this.loadPlanoPagamento(true);
        }

        this.loadEndereco(iniciarVenda);

        this._storageService.saveClienteCompleto(this.clienteCompleto);
      }
      this._dialogService.close(progress);
    });

    this._subs.push(subs);
  }

  private loadTipoVenda(iniciarVenda: boolean): void {
    if (this.vendaCompleta) {
      const progress = this._dialogService.showProgress(ProgressComponent);
      const subs = this._vendaService.getTipoVenda(this.idCliente).subscribe((venda) => {
        this.tipovenda = venda;

        if (iniciarVenda && this.verificarTipoVenda(+this.vendaCompleta.condicao_venda_pedido)) {
          this.atendimentoForm.patchValue({
            condicao_venda_pedido: this.vendaCompleta.condicao_venda_pedido
          });
        }

        this._dialogService.close(progress);
      });

      this._subs.push(subs);
    }
  }

  private loadTipoCobranca(iniciarVenda: boolean): void {
    if (this.vendaCompleta) {
      const progress = this._dialogService.showProgress(ProgressComponent);
      const subs = this._vendaService.getTipoCobrancaByClienteRCA(this.vendaCompleta.codigo_cliente, this.vendaCompleta.codigo_rca).subscribe((cobranca) => {
        this.tipocobranca = cobranca;

        if (iniciarVenda && this.verificarCobrancaExiste(this.clienteCompleto.codigo_cobranca_cliente)) {
          this.atendimentoForm.patchValue({
            codigo_cobranca_pedido: this.clienteCompleto.codigo_cobranca_cliente
          });
        }
        this._dialogService.close(progress);
      });

      this._subs.push(subs);
    }
  }

  private loadEndereco(iniciarVenda: boolean): void {
    if (this.clienteCompleto) {
      const progress = this._dialogService.showProgress(ProgressComponent);
      const subs = this._clienteService.getAllEndereco(this.clienteCompleto.codigo_cliente).subscribe((enderecos) => {

        this.enderecos = enderecos;

        const enderecoDefault = this.enderecos.find(e => e.codigo_endereco == 0);

        if (enderecoDefault !== undefined && this.vendaCompleta.codigo_endereco_entrega_pedido === 0) {

          this.atendimentoForm.patchValue({
            codigo_endereco_entrega_pedido: 0
          });
        }
        this._dialogService.close(progress);
      });

      this._subs.push(subs);
    }
  }

  private verificarTipoVenda(idvenda: number): boolean {
    const itemEncontrado = this.tipovenda.find(item => item.id === idvenda);
    return itemEncontrado !== undefined;
  }

  private verificarCobrancaExiste(codigoCobranca: string): boolean {
    const itemEncontrado = this.tipocobranca.find(item => item.codigo_cobranca === codigoCobranca);
    return itemEncontrado !== undefined;
  }

  private loadPlanoPagamento(iniciarVenda: boolean): void {
    if (this.vendaCompleta) {
      const progress = this._dialogService.showProgress(ProgressComponent);
      const subs = this._planoPagamentoService.getPlanoPagamento(this.vendaCompleta.codigo_cliente, this.vendaCompleta.codigo_rca).subscribe((planoPagamento) => {
        this.planopagamento = planoPagamento;
        this.planoPagamentoExibir = planoPagamento;

        if (iniciarVenda && this.verificarPlanoPagamentoExiste(this.clienteCompleto.codigo_plano_pagamento_cliente)) {
          this.atendimentoForm.patchValue({
            codigo_plan_pagamento_pedido: this.clienteCompleto.codigo_plano_pagamento_cliente
          });
        }
        this._dialogService.close(progress);
      });

      this._subs.push(subs);
    }
  }

  private verificarPlanoPagamentoExisteLista(codigoPlanoPagamento: number, listaPlanosPagamentos: PlanoPagamento[]): PlanoPagamento | undefined {
    return listaPlanosPagamentos.find(item => item.codigo_plano_pagamento === codigoPlanoPagamento);
  }

  private verificarPlanoPagamentoExiste(codigoPlanoPagamento: number): boolean {
    if (!this.planopagamento) return false;
    const itemEncontrado = this.planopagamento.find(item => item.codigo_plano_pagamento === codigoPlanoPagamento);
    return itemEncontrado !== undefined;
  }

  private loadFiliais(iniciarVenda: boolean): void {
    const progress = this._dialogService.showProgress(ProgressComponent);

    const subs = this._vendaService.getAllFiliais().subscribe((filiais) => {
      this.filiais = filiais;

      if (iniciarVenda && this.filiais.length === 1) {
        const unidade = this.filiais[0];
        this.vendaCompleta.codigo_unidade_pedido = unidade.codigo_unidade;
        this.vendaCompleta.codigo_unidade_nf_pedido = unidade.codigo_unidade;

        this.atendimentoForm.patchValue({
          codigo_unidade_pedido: this.vendaCompleta.codigo_unidade_pedido,
          codigo_unidade_nf_pedido: this.vendaCompleta.codigo_unidade_nf_pedido
        });
      }
      this._dialogService.close(progress);
    });

    this._subs.push(subs);
  }

  private CreateFormPrincipal(isReadOnly: boolean) {
    this.atendimentoForm = this._formBuilder.group({
      codigo_endereco_entrega_pedido: [{ value: '', disabled: isReadOnly }],
      codigo_unidade_pedido: [{ value: '', disabled: isReadOnly }],
      codigo_unidade_nf_pedido: [{ value: '', disabled: isReadOnly }],
      numero_pedido_cliente: [{ value: '', disabled: isReadOnly }],
      numero_pedido_venda: [{ value: '', disabled: isReadOnly }],
      origem_pedido: [{ value: '', disabled: isReadOnly }],
      condicao_venda_pedido: [{ value: '', disabled: isReadOnly }],
      codigo_cobranca_pedido: [{ value: '', disabled: isReadOnly }],
      codigo_plan_pagamento_pedido: [{ value: '', disabled: isReadOnly }],
      data_entrega_pedido: [{ value: '', disabled: isReadOnly }]
    });
  }

  private CreateFormAdicionais(isReadOnly: boolean) {
    this.dadosAdicionaisForm = this._formBuilder.group({
      observacao_entrega_pedido: [{ value: '', disabled: isReadOnly }, Validators.maxLength(this.MAX_SIZE_OBSERVACAO_ENTREGA)],
      observacao_pedido: [{ value: '', disabled: isReadOnly }, Validators.maxLength(this.MAX_SIZE_OBSERVACAO_PEDIDO)]
    });
  }

  ngOnInit() {
  }

  private loadItensPedido(): void {

    if (this.vendaCompleta.itens) {
      this.setDataSource(this.vendaCompleta.itens);
    }
    else {
      this.vendaCompleta.itens = [];
    }
    this.calculaTotais();
  }

  private setDataSource(itensVenda: ItenVenda[]) {
    this.dataSource = new MatTableDataSource(itensVenda);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  onAdicionarItems(): void {

    this.salvaVendaCompletaFormNoStorage();
    
    this._router.navigateByUrl(`home/produto/${this.idVenda}`);
  }

  private salvaVendaCompletaFormNoStorage(): void {

    
    //this.vendaCompleta.codigo_cobranca_pedido = this.atendimentoForm.get('codigo_cobranca_pedido')?.value;
    this.vendaCompleta.codigo_plan_pagamento_pedido = this.atendimentoForm.get('codigo_plan_pagamento_pedido')?.value;
    this.vendaCompleta.codigo_unidade_nf_pedido = this.atendimentoForm.get('codigo_unidade_nf_pedido')?.value;
    this.vendaCompleta.codigo_unidade_pedido = this.atendimentoForm.get('codigo_unidade_pedido')?.value;
    this.vendaCompleta.condicao_venda_pedido = this.atendimentoForm.get('condicao_venda_pedido')?.value;
    this.vendaCompleta.data_entrega_pedido = this.atendimentoForm.get('data_entrega_pedido')?.value;
    this.vendaCompleta.codigo_endereco_entrega_pedido = this.atendimentoForm.get('codigo_endereco_entrega_pedido')?.value;
    this.vendaCompleta.numero_pedido_cliente = this.atendimentoForm.get('numero_pedido_cliente')?.value;
    this.vendaCompleta.numero_pedido_venda = this.atendimentoForm.get('numero_pedido_venda')?.value;
    this.vendaCompleta.origem_pedido = this.atendimentoForm.get('origem_pedido')?.value;

    this.vendaCompleta.observacao_pedido = this.dadosAdicionaisForm.get('observacao_pedido')?.value;
    this.vendaCompleta.observacao_entrega_pedido = this.dadosAdicionaisForm.get('observacao_entrega_pedido')?.value;

    this._storageService.saveVendaCompleta(this.vendaCompleta);
    this._storageService.saveVendaCompletaTipoEntrega(this.tipoentregaselected);
  }

  onRowClicked(produto: Produto) {
    const modal = this._dialogService.show(ProdutoPopupComponent,
      { id: produto.codigo_produto },
      []
    );

    modal.componentInstance.closeModal.subscribe(() => {
      this._dialogService.close(modal);

      this.vendaCompleta = this._storageService.getVendaCompleta();
      this.loadItensPedido();
    });
  }

  keyPressAlphaNumeric(event: any) {

    var inp = String.fromCharCode(event.keyCode);

    if (/[a-zA-Z0-9]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  private criarVendaCompleta(): VendaCompleta {
    const dataEntregaPedido = new Date();
    dataEntregaPedido.setDate(dataEntregaPedido.getDate() + 1);
    return {
      codigo_pedido_rca: 0,
      codigo_pedido: 0,
      codigo_rca: +this.usuario.rca_code,
      nome_rca: this.usuario.name,
      codigo_cliente: this.idCliente,
      fantasia_cliente: '',
      razao_social: '',
      cnpj_cpf_cliente: '',
      data_hora_abertura_pedido: new Date(),
      data_hora_fechamento_pedido: undefined,
      numero_pedido_cliente: '',
      data_entrega_pedido: dataEntregaPedido.toISOString(),
      codigo_unidade_pedido: '',
      codigo_unidade_nf_pedido: '',
      codigo_unidade_retirada_pedido: '',
      valor_frete_pedido: 0,
      codigo_cobranca_pedido: '',
      codigo_plan_pagamento_pedido: 0,
      condicao_venda_pedido: '',
      observacao_pedido: '',
      observacao_entrega_pedido: '',
      frete_despacho_pedido: '',
      frete_rede_despacho_pedido: '',
      codigo_fornecedor_frete_pedido: '',
      prazo1_pedido: 0,
      prazo2_pedido: 0,
      prazo3_pedido: 0,
      prazo4_pedido: 0,
      prazo5_pedido: 0,
      prazo6_pedido: 0,
      prazo7_pedido: 0,
      prazo8_pedido: 0,
      prazo9_pedido: 0,
      prazo10_pedido: 0,
      prazo11_pedido: 0,
      prazo12_pedido: 0,
      origem_pedido: 'F',
      numero_pedido_comprador: '',
      posicao_atual_pedido: '',
      saldo_atual_rca: 0,
      tipo_prioridade_entrega_pedido: '',
      perc_desc_abatimento_pedido: 0,
      custo_bonificacao_pedido: '',
      cod_fornec_bonificacao_pedido: '',
      codigo_bonificao_pedido: '',
      agrupamento_pedido: '',
      codigo_endereco_entrega_pedido: 0,
      orcamento_pedido: '',
      valor_desconto_abatimento_pedido: 0,
      valor_entrada_pedido: 0,
      status_pedido: '',
      total_itens_pedido: 0,
      total_pedido: 0,
      total_pedido_com_imposto: 0,
      observacao_retorno: '',
      saldo_verba: 0,
      quebra_pedido_frete: '',
      percentual_frete_outra_filial: 0,
      codigo_filial_pedido_frete: '',
      codigo_produto_pedido_frete: '',
      preco_produto_pedido_frete: 0,
      codigo_pedido_rca_pedido_frete: 0,
      cidade_cliente: '',
      tipo_emissao: 0,
      quebra_pedido_pre_venda: '',
      codigo_pedido_rca_pedido_pre_venda: '',
      codigo_filial_pedido_pre_venda: '',
      retorno_numero_pedido_erp: 0,
      retorno_motivo_bloqueio: '',
      retorno_valor_pedido: 0,
      retorno_valor_atendido: 0,
      numero_pedido_venda: '',
      data_emissao_mapa: new Date(),
      numero_pedido_erp_origional: 0,
      comissao: 0,
      peso: 0,
      gerou_brinde: '',
      codigo_motorista: '',
      nome_motorista: '',
      celular_motorista: '',
      data_cadastro: new Date(),
      status_processamento: 'A',
      data_processamento: new Date(),
      mensagem_processamento: '',
      nome_arquivo_remessa: '',
      id_usuario: this.usuario.id,
      endereco_cliente: '',
      itens: []
    };
  }

  private setaOpcoesPadraoForm(): void {
    this.atendimentoForm.patchValue({
      data_entrega_pedido: this.vendaCompleta.data_entrega_pedido,
      origem_pedido: this.vendaCompleta.origem_pedido,
    });
  }


  private setaLimiteDataEntrega(): void {

    if (this.vendaCompleta && this.vendaCompleta.codigo_unidade_pedido !== '') {

      const progress = this._dialogService.showProgress(ProgressComponent);
      const subs = this._parametroService.getParametro(+this.vendaCompleta.codigo_unidade_pedido, "MAXIMO_DIAS_DATAENTREGA").subscribe((parametro) => {

        if (parametro && parametro.valor_parametro !== '') {
          this.daysFromTomorrow = +parametro.valor_parametro;
        }

        this.minDate = new Date();
        this.minDate.setDate(this.minDate.getDate() + 1);
        this.maxDate = new Date();
        this.maxDate.setDate(this.maxDate.getDate() + this.daysFromTomorrow);
        this._dialogService.close(progress);
      });

      this._subs.push(subs);
    }
  }

  onExcluiItem(itemVenda: ItenVenda) {
    const respostaLogout = this._dialogConfirmationService.openDialog({
      header: 'Exclusão',
      message: 'Deseja realmente excluir o item?',
      txtAct: 'Sim',
      txtCancel: 'Não'
    });

    respostaLogout.subscribe((resposta: boolean) => {
      if (!resposta) return;

      this.excluirItemVenda(itemVenda);
    });
  }

  excluirItemVenda(itemVenda: ItenVenda) {
    if (!this.vendaCompleta.itens || this.vendaCompleta.itens.length <= 0) return;

    const itemIndex = this.vendaCompleta.itens.findIndex(item => item.codigo_produto === itemVenda.codigo_produto);
    if (itemIndex < 0) return;

    this.vendaCompleta.itens.splice(itemIndex, 1);

    this.recalculaValoresVenda(this.vendaCompleta);
    this._storageService.saveVendaCompleta(this.vendaCompleta);

    this.vendaCompleta = this._storageService.getVendaCompleta();
    this.loadItensPedido();
  }

  recalculaValoresVenda(vendaCompleta: VendaCompleta) {
    vendaCompleta.total_itens_pedido = 0;
    vendaCompleta.total_pedido = 0;
    vendaCompleta.total_pedido_com_imposto = 0;

    if (vendaCompleta.itens && vendaCompleta.itens.length > 0) {
      let numeroItem = 1;
      vendaCompleta.itens.forEach(item => {
        item.item = numeroItem;
        item.valor_total = item.preco_venda * item.quantidade;
        item.valor_total_com_imposto = item.preco_venda * item.quantidade;
        item.valor_total_com_st = item.preco_venda * item.quantidade;
        numeroItem++;
      });

      vendaCompleta.total_itens_pedido = vendaCompleta.itens.reduce((total, item) => {
        return total + item.valor_total;
      }, 0);

      vendaCompleta.total_pedido = vendaCompleta.total_itens_pedido;
      vendaCompleta.total_pedido_com_imposto = vendaCompleta.total_itens_pedido;
    }
  }

  confirmarFinalizarPedido() {
    this.vendaCompleta = this._storageService.getVendaCompleta();
    
    this.vendaCompleta.codigo_cobranca_pedido = this.atendimentoForm.get('codigo_cobranca_pedido')?.value;
    this.vendaCompleta.codigo_plan_pagamento_pedido = this.atendimentoForm.get('codigo_plan_pagamento_pedido')?.value;
    this.vendaCompleta.observacao_pedido = this.dadosAdicionaisForm.get('observacao_pedido')?.value;
    this.vendaCompleta.observacao_entrega_pedido = this.dadosAdicionaisForm.get('observacao_entrega_pedido')?.value;

    if (!this.vendaCompleta.itens || this.vendaCompleta.itens.length <= 0) {
      this._notificationService.showToast({
        message: "O pedido está sem itens",
        typeToast: TypeToast.ERROR
      });
      return;
    }
/*
    if (this.vendaCompleta.observacao_pedido.length > this.MAX_SIZE_OBSERVACAO_PEDIDO) {
      this._notificationService.showToast({
        message: "Observação de pedido não pode ser maior que " + this.MAX_SIZE_OBSERVACAO_PEDIDO,
        typeToast: TypeToast.ERROR
      });
      return;
    }

    if (this.vendaCompleta.observacao_entrega_pedido.length > this.MAX_SIZE_OBSERVACAO_ENTREGA) {
      this._notificationService.showToast({
        message: "Observação de entrega não pode ser maior que " + this.MAX_SIZE_OBSERVACAO_ENTREGA,
        typeToast: TypeToast.ERROR
      });
      return;
    }
*/

    const progress = this._dialogService.showProgress(ProgressComponent);

    this.vendaCompleta.data_hora_fechamento_pedido = new Date();
    this.vendaCompleta.itens.forEach(ite => {
      ite.codigo_pedido_rca = this.vendaCompleta.codigo_pedido_rca;
      ite.codigo_unidade_retirada = this.vendaCompleta.codigo_unidade_pedido;
    });

    //this.vendaCompleta.codigo_pedido_rca = 0;

    
    this._storageService.saveVendaCompleta(this.vendaCompleta);
    
    if(this.vendaCompleta.codigo_pedido_rca == 0){
      this.descAcaoAtendimentoRota = 'Novo Atendimento'      
      this._vendaService.saveVenda(this.vendaCompleta)
        .subscribe((vendaInserida: VendaInseridaNovo) => {
          this.vendaCompleta.codigo_pedido_rca = vendaInserida.CodigoPedidoRCA //(vendaInserida as VendaInserida).CodigoPedidoRCA;
          this.idVenda = this.vendaCompleta.codigo_pedido_rca;
          this._storageService.saveVendaCompleta(this.vendaCompleta);

          this._dialogService.close(progress);

          const respostaConfirmacao = this._dialogConfirmationService.openDialog({
            header: 'Sucesso',
            message: 'Pedido enviado com sucesso!\n\nNúmero do pedido: ' + this.vendaCompleta.codigo_pedido_rca,
            txtAct: 'Ok',
          });

          respostaConfirmacao.subscribe((resposta: boolean) => {
            this._router.navigate(['/home/dashboard']);
          });

        }, (error: any) => {

          this._dialogService.close(progress);

          this._notificationService.showToast({
            message: "Erro ao finalizar e enviar pedido.",
            typeToast: TypeToast.ERROR
          });
      });
    }else{
      this._vendaService.updateVenda(this.vendaCompleta).pipe(        
        catchError(error => {
          console.error("Erro ao atualizar a venda", error);
          this._notificationService.showToast({
            message: "Erro ao finalizar e enviar pedido.",
            typeToast: TypeToast.ERROR
          });
          return of(null); // Retorna um valor padrão em caso de erro
        }),
        finalize(() => {
          this._dialogService.close(progress); // Fecha o progress tanto em sucesso quanto em erro
        })
      ).subscribe(
        response => {
          if (response) {
            this._router.navigate(['/home/dashboard']);
          }
        }
      );
    }
  }

  finalizarPedido() {

    const respostaLogout = this._dialogConfirmationService.openDialog({
      header: 'Atenção',
      message: 'Deseja realmente finalizar e enviar o pedido?',
      txtAct: 'Sim',
      txtCancel: 'Não'
    });

    respostaLogout.subscribe((resposta: boolean) => {
      if (!resposta) return;

      this.confirmarFinalizarPedido();
    });

  }

  onShowTransportadora() {
    const modal = this._dialogService.open(TransportadoraPopupComponent, {
      data: {}
    });

    modal.componentInstance.result$.subscribe((result: Transportadora) => {

      this._dialogService.close(modal);
    });

    modal.componentInstance.closeModal.subscribe(() => {
      this._dialogService.close(modal);
    });
  }
  
}
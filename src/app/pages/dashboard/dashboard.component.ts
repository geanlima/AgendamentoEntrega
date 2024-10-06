import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DefinirMetaPopupComponent } from '@core/components';
import { ProgressComponent } from '@shared/components';
import { Usuario } from '@shared/models';
import { DashboardService, DialogService, StorageService } from '@shared/services';
import { Observable, Subscription } from 'rxjs';
import { Mensagem } from 'src/app/shared/models/mensagem';
import { Venda } from 'src/app/shared/models/venda';
import { DialogConfirmationService } from 'src/app/shared/services/dialog-confirmation.service';
import { ObjetivoDiaService } from 'src/app/shared/services/objetivodia.service';
import { VendaService } from 'src/app/shared/services/venda.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnDestroy, AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public displayedColumns = ['rca_order_id', 'date', 'date_delivery', 'client_code', 'fantasy_name', 'order_number_erp', 'type_sale', 'total_order_amount', 'status', 'payment_situation_erp', 'action'];
  public dataSource!: MatTableDataSource<Venda>;
  public page: number = 0;
  public pageSize: number = 8;

  public usuario: Usuario;
  public valorFaturado = '';
  public valorPositivaCao = '';
  public valorTicketMedio = '';
  public valorProjecaoResultado = '';

  public porcentagemFaturado = 0;
  public porcentagemPositivacao = 0;

  public avisorecente = '';
  public dataviso = '';

  public mensagens: Mensagem[] = [];
  public mensagensNaoLidas: string = '';
  public porcentagemMeta = 0;
  public valorFaturamentoDia = 0;
  public valorMetaDia = 0;

  private _subs: Subscription[] = [];

  constructor(
    private _router: Router,
    private _vendaService: VendaService,
    private _objetivoDiaService: ObjetivoDiaService,
    private _dialogService: DialogService,
    private _storageService: StorageService,
    private _dialogConfirmation: DialogConfirmationService,
    private _dashboardService: DashboardService,
    private _http: HttpClient,
  ) {
    this.usuario = this._storageService.getUsuario();
    this.loadValoresMetadodia();
    this.loadDashboard();
    this.loadMensagens();
    this.loadValoresMetadodia();
  }

  loadValoresMetadodia() {
    const subs = this._objetivoDiaService.getObjetivoDiaById(this.usuario.supervisor_id).subscribe((objetivodia) => {
      if (objetivodia) {
        this.valorFaturamentoDia = objetivodia.VALORVENDIDO;
        this.valorMetaDia = objetivodia.VALORMETA;
        if (this.valorMetaDia !== 0) {
          this.porcentagemMeta = (this.valorFaturamentoDia / this.valorMetaDia) * 100;
        }
        else {
          this.porcentagemMeta = 0;
        }
      }

    });

    this._subs.push(subs);
  }

  loadMensagens() {
    this.avisorecente = 'Informamos que, devido a greve de caminhoneiros estamos enfrentando problemas em nossos galpões.    Recomendamos que você monitore manualmente os estoques em um log disponível neste sistema para posterior    reconciliação. Priorize os pedidos pendentes de clientes para evitar atrasos na entrega. Atenciosamente,    Equipe de Gestão de Incidentes';
    this.dataviso = this.dataPorExtenso(new Date());

    const subs = this.getMensagens().subscribe(mensagens => {
      const totalNaoLidas = mensagens.filter(mensagem => !mensagem.lido && mensagem.tipo === 'mensagem').length;

      this.mensagensNaoLidas = totalNaoLidas > 1 ? totalNaoLidas + ' mensagems' : totalNaoLidas + 'mensagem';

      this.mensagens = mensagens.filter(mensagem => mensagem.tipo === 'mensagem').slice(0, 3);
    });

    this._subs.push(subs);

  }

  carregaPedidos() {
    this.loadVendas();
    this.limpaLocaStorage();
  }

  ngAfterViewInit(): void {
    this.carregaPedidos();
  }

  private limpaLocaStorage(): void {
    this._storageService.removeClienteCompleto();
    this._storageService.removeVendaCompleta();
  }

  getMensagens(): Observable<Mensagem[]> {
    return this._http.get<Mensagem[]>('./../assets/mockdata/mensagens.json');
  }

  ngOnDestroy(): void {
    this._subs.forEach((sub: Subscription) => sub.unsubscribe());
  }

  getTipoVenda(idTipoVenda: string): string {
    let strReturn = '';
    //TODO: obter do json
    switch (idTipoVenda) {
      case '1':
        strReturn = "Venda Normal";
        break;
      case '5':
        strReturn = "Bonificação";
        break;
      default:
        break;
    }

    return strReturn;
  }

  onRowClicked(venda: Venda) {
    this._router.navigate(['/home/atendimento', venda.rca_order_id, 'S']);
  }


  onDefinirMeta() {

    const metaPopup = this._dialogService.show(DefinirMetaPopupComponent,
      {
        metaAtual: this.valorMetaDia,
        valorFaturado: this.valorFaturamentoDia
      },
      ['override-modal-titulos'],
      true,
      true,
      '312px',
      '462px',
    );

    metaPopup.componentInstance.closeModal.subscribe(() => {
      this._dialogService.close(metaPopup);
      this.loadValoresMetadodia();
    });

  }

  private loadVendas(): void {
    const progress = this._dialogService.showProgress(ProgressComponent);
    const subs = this._vendaService.getAllVendas().subscribe((vendas) => {
      this.setDataSource(vendas);
      this._dialogService.close(progress);
    });

    this._subs.push(subs);
  }

  private loadDashboard(): void {

    const subs = this._dashboardService.getResumoMes().subscribe((resumo) => {
      if (resumo) {

        this.valorFaturado = resumo.valorFaturadoMes.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        this.porcentagemFaturado = resumo.percentualCrescimento;

        this.valorPositivaCao = resumo.quantidadeClientePositivoMes + '/' + resumo.qtCliCarteira;
        this.porcentagemPositivacao = resumo.percentCrescimentoPositivacao;

        this.valorTicketMedio = resumo.ticketMedio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        this.valorProjecaoResultado = resumo.projecaoResultado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      }

    });

    this._subs.push(subs);
  }


  private setDataSource(vendas: Venda[]) {
    this.dataSource = new MatTableDataSource(vendas);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  enviar(): void {
    const resposta = this._dialogConfirmation.openDialog({
      header: 'Enviar',
      message: 'Deseja realmente enviar?',
      txtAct: 'Ok',
      txtCancel: 'Cancelar'
    });

    resposta.subscribe((resposta: boolean) => {
      if (!resposta) return;
    });
  }

  excluir(): void {
    const resposta = this._dialogConfirmation.openDialog({
      header: 'Excluir registro',
      message: 'Deseja realmente excluir?',
      txtAct: 'Ok',
      txtCancel: 'Cancelar'
    });

    resposta.subscribe((resposta: boolean) => {
      if (!resposta) return;
    });
  }

  onEditPedido(venda: Venda): void {
    this._router.navigate(['/home/atendimento-edit/', venda.rca_order_id]);
  }

  showPedidoRetorno(venda: Venda) {
    const resposta = this._dialogConfirmation.openDialog({
      header: 'Retorno do pedido',
      message: this.trataMensagemRetornoPedido(venda),
      txtAct: 'Ok',
    });
  }

  trataMensagemRetornoPedido(venda: Venda): string {
    const mensagem = venda.observation_return;
    const div = document.createElement('div');
    div.innerHTML = mensagem;
    return div.textContent || div.innerText || '';
  }

  dataPorExtenso(data: Date): string {
    const meses = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    const dia = data.getDate();
    const mes = data.getMonth();
    const ano = data.getFullYear();

    return `${dia} de ${meses[mes]} de ${ano}`;
  }

}



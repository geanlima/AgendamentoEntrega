import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessagePopupComponent } from '@core/components';
import { DialogService } from '@shared/services';
import { Observable, Subscription } from 'rxjs';
import { Mensagem } from 'src/app/shared/models/mensagem';

@Component({
  selector: 'app-mensagens',
  templateUrl: './mensagens.component.html',
  styleUrls: ['./mensagens.component.scss']
})
export class MensagensComponent implements OnInit, OnDestroy {

  public mensagens: Mensagem[] = [];

  private _subs: Subscription[] = [];

  selectedMessageId: number | null = null;

  paramIdMensagem: number = 0;

  selectedMessage: Mensagem | undefined = undefined;

  selectedTabIndex: number = 2;

  constructor(
    private _activatedRouter: ActivatedRoute,
    private _dialog: DialogService,
    private _http: HttpClient,
  ) {
    const idMensagemRoute = this._activatedRouter.snapshot.paramMap.get('idmensagem');

    if (idMensagemRoute) {
      this.paramIdMensagem = +idMensagemRoute;
    }
  }

  ngOnInit(): void {
    this.loadMensagens();
  }

  onNovaMensagemClick(): void {
    const novaMensagemPopup = this._dialog.show(MessagePopupComponent,
      {},
      ['override-modal-titulos'],
      true,
      true,
      '420px',
      '822px'
    );

    novaMensagemPopup.componentInstance.closeModal.subscribe(() => {
      this._dialog.close(novaMensagemPopup);
    });
  }


  ngOnDestroy(): void {
    this._subs.forEach((sub: Subscription) => sub.unsubscribe());
  }

  getMensagens(): Observable<Mensagem[]> {
    return this._http.get<Mensagem[]>('./../assets/mockdata/mensagens.json');
  }

  loadMensagens() {

    const subs = this.getMensagens().subscribe(mensagens => {
      this.mensagens = mensagens;
      this.selectMessage(this.paramIdMensagem);
    });

    this._subs.push(subs);
  }

  selectMessage(id: number): void {
    this.selectedMessageId = id;
    this.selectedMessage = this.mensagens.find(m => m.id === id);
    if (this.selectedMessage) {
      this.selectedMessage.lido = true;
    }
  }

  countUnreadMessages(): number {
    return this.mensagens.filter(mensagem => !mensagem.lido && mensagem.tipo === 'mensagem').length;
  }

  countUnreadAvisos(): number {
    return this.mensagens.filter(mensagem => !mensagem.lido && mensagem.tipo === 'aviso').length;
  }

  getFilteredMessages(): any[] {
    switch (this.selectedTabIndex) {
      case 0:
        return this.mensagens.filter(mensagem => mensagem.tipo === 'mensagem');
      case 1:
        return this.mensagens.filter(mensagem => mensagem.tipo === 'aviso');
      case 2:
      default:
        return this.mensagens;
    }
  }
}

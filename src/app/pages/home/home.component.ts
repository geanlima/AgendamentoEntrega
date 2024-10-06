import { Component, OnDestroy, OnInit } from '@angular/core';
import { AtendimentoPopupComponent } from '@core/components';
import { DialogService, ShortcutService } from '@shared/services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly subs$: Subscription[] = [];

  constructor(
    private dialog: DialogService,
    private shortcut: ShortcutService
  ) { }

  ngOnInit(): void {
    const subs = this.shortcut.addShortcut({ keys: 'shift.v' })
      .subscribe(() => {
        this.onIniciarVenda();
      });
    this.subs$.push(subs);
  }

  ngOnDestroy(): void {
    this.subs$.forEach((sub: Subscription) => {
      if (sub && !sub.closed) {
        sub.unsubscribe()
      }
    });
  }

  onIniciarVenda(): void {
    const modalAtendimento = this.dialog.show(AtendimentoPopupComponent,
      {},
      ['override-modal-atendimento'],
      true,
      true,
      '800px',
      '1800px'
    );

    modalAtendimento.componentInstance.closeModal.subscribe(() => {
      this.dialog.close(modalAtendimento);
    });
  }
}

import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from '@env';
import { StorageService } from '@shared/services';
import { Subscription } from 'rxjs';
import { ObjetivoDia } from 'src/app/shared/models/objetivodia';
import { ObjetivoDiaService } from 'src/app/shared/services/objetivodia.service';

@Component({
  selector: 'app-definir-meta-popup',
  templateUrl: './definir-meta-popup.component.html',
  styleUrls: ['./definir-meta-popup.component.scss']
})
export class DefinirMetaPopupComponent implements OnDestroy {

  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  public valorMetaAtual = 0;
  public valorFaturado = 0;
  public valorMetaAtualizar: number | undefined;

  private _subs: Subscription[] = [];

  constructor(
    private _objetivoDiaService: ObjetivoDiaService,
    private _storageService: StorageService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.valorMetaAtual = data.metaAtual ? data.metaAtual : 0;
    this.valorFaturado = data.valorFaturado ? data.valorFaturado : 0;
  }

  ngOnDestroy(): void {
    this._subs.forEach((sub: Subscription) => sub.unsubscribe());
  }

  onCloseModal(): void {
    this.closeModal.emit();
  }

  alterarMeta(): void {

    if (this.valorMetaAtualizar) {
      const usuario = this._storageService.getUsuario();
      const objetivodia: ObjetivoDia = {
        data: this.novaDataComDiaMesAnoAtual(),
        valorMeta: this.valorMetaAtualizar,
        codigoSupervisor: usuario.supervisor_id,
        codigoUnidade: +environment.unidade
      };
      const subs = this._objetivoDiaService.saveObjetivoDia(objetivodia).subscribe((_) => {
        this.onCloseModal();
      });
      this._subs.push(subs);
    }
  }

  private novaDataComDiaMesAnoAtual(): Date {
    const dataAtual = new Date();
    return new Date(dataAtual.getFullYear(), dataAtual.getMonth(), dataAtual.getDate());
  }

}

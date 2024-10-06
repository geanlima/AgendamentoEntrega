import { Component, EventEmitter, Input, Output } from '@angular/core';
import { StorageService } from '@shared/services';
import { VendaCompleta } from 'src/app/shared/models/venda';

@Component({
  selector: 'app-rodape-produto',
  templateUrl: './rodape-produto.component.html',
  styleUrls: ['./rodape-produto.component.scss']
})
export class RodapeProdutoComponent {
  @Output() retornar: EventEmitter<void> = new EventEmitter<void>();
  @Input() eventoAtualizaValores!: EventEmitter<string>;
  @Input() venda: VendaCompleta = {} as VendaCompleta;

  constructor(
    private storageService: StorageService,
  ) { }

  ngOnInit() {
    this.eventoAtualizaValores.subscribe(ite => {
      
      this.venda = this.storageService.getVendaCompleta();
    });
  }

  onRetornar(): void {
    this.retornar.emit();
  }
}

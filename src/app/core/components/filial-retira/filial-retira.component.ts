import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Filial, ItenVenda, Venda, VendaCompleta } from 'src/app/shared/models/venda';

@Component({
  selector: 'app-filial-retira',
  templateUrl: './filial-retira.component.html',
  styleUrls: ['./filial-retira.component.scss']
})
export class FilialRetiraComponent {
  @Input() filiaisRetira: Filial[] | null = {} as Filial[];
  @Input() itemVenda: ItenVenda = {} as ItenVenda;
}

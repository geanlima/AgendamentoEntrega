import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-panel-small',
  templateUrl: './card-panel-small.component.html',
  styleUrls: ['./card-panel-small.component.scss']
})
export class CardPanelSmallComponent {

  @Input() valor: string = '';
  @Input() titulo: string = '';
  @Input() corValor: string = '';

  constructor() { }

}

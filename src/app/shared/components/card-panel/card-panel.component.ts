import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-panel',
  templateUrl: './card-panel.component.html',
  styleUrls: ['./card-panel.component.scss']
})
export class CardPanelComponent {
  @Input() valor1: string = '';
  @Input() titulo1: string = '';
  @Input() valor2: string = '';
  @Input() titulo2: string = '';
  @Input() corValor: string = '';

  constructor() { }

}

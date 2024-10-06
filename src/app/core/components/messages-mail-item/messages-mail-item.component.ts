import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-messages-mail-item',
  templateUrl: './messages-mail-item.component.html',
  styleUrls: ['./messages-mail-item.component.scss']
})
export class MessagesMailItemComponent implements OnInit {

  @Input() de: string = '';
  @Input() assunto: string = '';
  @Input() lido: boolean = false;
  @Input() texto: string = '';
  @Input() data!: Date;
  @Input() tipo: string = '';

  constructor(

  ) { }

  ngOnInit() {
  }

  iconMailState(): string {
    return this.lido ? 'mail' : 'mail';
  }


  CallPainelMensagens() {

  }


}

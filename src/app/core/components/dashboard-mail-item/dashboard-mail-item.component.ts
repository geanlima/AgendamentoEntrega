import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-mail-item',
  templateUrl: './dashboard-mail-item.component.html',
  styleUrls: ['./dashboard-mail-item.component.scss']
})
export class DashboardMailItemComponent implements OnInit {

  @Input() de: string = '';
  @Input() assunto: string = '';
  @Input() lido: boolean = false;
  @Input() id: number = 0;
  constructor(
    private _router: Router,
  ) { }

  ngOnInit() {
  }

  iconMailState(): string {
    return this.lido ? 'mail' : 'mail';
  }


  CallPainelMensagens() {
    this._router.navigate(['/home/mensagens', this.id]);
  }

}

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-card',
  templateUrl: './dashboard-card.component.html',
  styleUrls: ['./dashboard-card.component.scss']
})
export class DashboardCardComponent implements OnInit {
  @Input() imagePath: string = '';
  @Input() cardText: string = '';
  @Input() cardValue: string = '';
  @Input() color: string = 'Black';
  @Input() porcentagem: number | undefined;


  constructor() { }

  ngOnInit() {
  }

}

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-status-credito',
  templateUrl: './status-credito.component.html',
  styleUrls: ['./status-credito.component.scss']
})
export class StatusCreditoComponent implements OnInit {

  @Input() value: boolean = true;

  constructor() { }

  ngOnInit() {
  }

}

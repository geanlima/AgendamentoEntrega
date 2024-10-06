import { Component, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SACCliente } from '@shared/models';
import { ClienteService } from '@shared/services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-atendimento-sac',
  templateUrl: './atendimento-sac.component.html',
  styleUrls: ['./atendimento-sac.component.scss']
})
export class AtendimentoSacComponent implements OnDestroy {

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public SACCliente: SACCliente[] = [];

  private _subs: Subscription[] = [];


  public displayedColumns = ['dataAbertura', 'atendente', 'protocolo', 'assunto', 'descricao', 'situacao', 'providencia'];
  public dataSource!: MatTableDataSource<SACCliente>;
  public page: number = 0;
  public pageSize: number = 8;


  constructor(private _clienService: ClienteService) { }


  ngOnDestroy(): void {
    this._subs.forEach((sub: Subscription) => sub.unsubscribe());
  }

  setClientSAC(id: number) {
    const subs = this._clienService.getAllSAC(id).subscribe((sac) => {
      this.SACCliente = sac;
      this.setDataSource(this.SACCliente);
    });

    this._subs.push(subs);
  }

  private setDataSource(SACCliente: SACCliente[]) {
    this.dataSource = new MatTableDataSource(SACCliente);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
}
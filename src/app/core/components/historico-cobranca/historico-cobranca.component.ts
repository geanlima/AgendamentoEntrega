import { Component, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HistoricoCobranca } from '@shared/models';
import { ClienteService } from '@shared/services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-historico-cobranca',
  templateUrl: './historico-cobranca.component.html',
  styleUrls: ['./historico-cobranca.component.scss']
})
export class HistoricoCobrancaComponent implements OnDestroy {

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public HistoricoCobranca: HistoricoCobranca[] = [];

  private _subs: Subscription[] = [];


  public displayedColumns = ['data', 'telcob', 'contato', 'obS1', 'obS2'];
  public dataSource!: MatTableDataSource<HistoricoCobranca>;
  public page: number = 0;
  public pageSize: number = 8;


  constructor(private _clienteService: ClienteService) { }


  ngOnDestroy(): void {
    this._subs.forEach((sub: Subscription) => sub.unsubscribe());
  }

  setHistoricoCobrancaCliente(id: number) {
    const subs = this._clienteService.getAllHistoricoCobranca(id).subscribe((historico) => {
      this.HistoricoCobranca = historico;
      this.setDataSource(this.HistoricoCobranca);
    });

    this._subs.push(subs);
  }

  private setDataSource(HistoricoCobranca: HistoricoCobranca[]) {
    this.dataSource = new MatTableDataSource(HistoricoCobranca);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
}

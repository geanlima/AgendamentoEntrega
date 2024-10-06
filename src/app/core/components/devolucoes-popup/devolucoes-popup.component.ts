import { AfterViewInit, Component, EventEmitter, Inject, Output, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Devolucoes } from 'src/app/shared/models/devolucoes';

@Component({
  selector: 'app-devolucoes-popup',
  templateUrl: './devolucoes-popup.component.html',
  styleUrls: ['./devolucoes-popup.component.scss']
})
export class DevolucoesPopupComponent implements AfterViewInit {

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  public filterDataEntradaInicial: string = '';
  public filterDataEntradaFinal: string = '';
  public filterNumeroNota: string = '';
  public filterNotaOrigem: string = '';
  public filterProduto: string = '';

  public page: number = 0;
  public pageSize: number = 8;
  public searchTerm: string = '';
  public dataSource!: MatTableDataSource<Devolucoes>;
  public displayedColumns = ['dtEnt', 'notaOrigem', 'numNota', 'codProd', 'produto', 'qtd', 'vlTotal', 'motivo'];

  private devolucoes: Devolucoes[] = []

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {

    if (data.devolucoes) {
      this.devolucoes = data.devolucoes.sort(this.compararPorDataDesc);;
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.onSearchChanged();
    });
  }

  onCloseModal(): void {
    this.closeModal.emit();
  }

  private compararPorDataDesc(a: Devolucoes, b: Devolucoes) {
    return new Date(b.dtEnt).getTime() - new Date(a.dtEnt).getTime();
  }

  private setDataSource(devolucoes: Devolucoes[]) {
    this.dataSource = new MatTableDataSource(devolucoes);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  onSearchChanged(): void {
    let filteredData = this.devolucoes;

    if (this.filterDataEntradaInicial) {

      const dataEntradaInicial = new Date(this.filterDataEntradaInicial);

      filteredData = filteredData.filter(t => new Date(t.dtEnt) >= dataEntradaInicial);
    }

    if (this.filterDataEntradaFinal) {

      const dataEntradaFinal = new Date(this.filterDataEntradaFinal);

      filteredData = filteredData.filter(t => new Date(t.dtEnt) <= dataEntradaFinal);
    }

    if (this.filterNumeroNota) {
      filteredData = filteredData.filter(t => t.numNota.toString().toLocaleLowerCase().includes(this.filterNumeroNota.toLocaleLowerCase()));
    }

    if (this.filterNotaOrigem) {
      filteredData = filteredData.filter(t => t.notaOrigem.toString().toLocaleLowerCase().includes(this.filterNotaOrigem.toLocaleLowerCase()));
    }

    if (this.filterProduto) {
      filteredData = filteredData.filter(t => t.produto.toString().toLocaleLowerCase().includes(this.filterProduto.toLocaleLowerCase()));
    }

    this.setDataSource(filteredData);
  }


}

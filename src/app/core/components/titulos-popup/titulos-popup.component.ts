import { AfterViewInit, Component, EventEmitter, Inject, OnDestroy, Output, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Titulo } from 'src/app/shared/models/titulo';

@Component({
  selector: 'app-titulos-popup',
  templateUrl: './titulos-popup.component.html',
  styleUrls: ['./titulos-popup.component.scss']
})
export class TitulosPopupComponent implements AfterViewInit, OnDestroy {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  private _subs: Subscription[] = [];

  private readonly VIEW_CODE: string = 'POPUP_TITULO';
  public searchTerm: string = '';


  public tituloCabecalho: string = '';
  public filterDataEmissaoInicial: string = '';
  public filterDataEmissaoFinal: string = '';
  public filterDataVencimentoInicial: string = '';
  public filterDataVencimentoFinal: string = '';
  public filterTipoPagamento: string = '';
  public checkedAVencer = false;
  public checkedVencido = false;
  public checkedBaixado = false;

  public page: number = 0;
  public pageSize: number = 8;

  public dataSource!: MatTableDataSource<Titulo>;
  public displayedColumns = ['duplicata', 'parcela', 'cobranca', 'valorOriginal', 'situacao', 'dataEmissao', 'dataVencimento', 'codBarrasBoleto'];

  private titulos: Titulo[] = [];

  public tipoCobranca: Titulo[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data.titulos) {

      this.titulos = data.titulos;

      this.titulos.sort((a: Titulo, b: Titulo) => {
        if (a.dataVencimento > b.dataVencimento) {
          return -1;
        } else if (a.dataVencimento < b.dataVencimento) {
          return 1;
        } else {
          return 0;
        }
      });


      this.titulos
    }

    if (data.tituloAberto) {
      this.checkedAVencer = true;
      this.checkedVencido = false;
    }
    else {
      this.checkedVencido = true;
      this.checkedAVencer = false;
    }
  }

  private getCobranca(titulos: Titulo[]): Titulo[] {
    const unique = new Map<number, Titulo>();
    titulos.forEach(titulo => {
      if (!unique.has(titulo.codigoCobranca)) {
        unique.set(titulo.codigoCobranca, titulo);
      }
    });
    return Array.from(unique.values());
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.tipoCobranca = this.getCobranca(this.titulos);
      this.onSearchChanged();
    });
  }

  ngOnDestroy(): void {
    this._subs.forEach((sub: Subscription) => sub.unsubscribe());
  }

  onCloseModal(): void {
    this.closeModal.emit();
  }

  onSearchChanged(): void {

    let filteredData = this.titulos;

    if (this.filterDataEmissaoInicial) {

      const dataEmissaoInicial = new Date(this.filterDataEmissaoInicial);

      filteredData = filteredData.filter(t => new Date(t.dataEmissao) >= dataEmissaoInicial);
    }

    if (this.filterDataEmissaoFinal) {

      const dataEmissaoFinal = new Date(this.filterDataEmissaoFinal);

      filteredData = filteredData.filter(t => new Date(t.dataEmissao) <= dataEmissaoFinal);
    }


    if (this.filterDataVencimentoInicial) {

      const dataVencimentoInicial = new Date(this.filterDataVencimentoInicial);

      filteredData = filteredData.filter(t => new Date(t.dataVencimento) >= dataVencimentoInicial);
    }

    if (this.filterDataVencimentoFinal) {

      const dataVencimentoFinal = new Date(this.filterDataVencimentoFinal);

      filteredData = filteredData.filter(t => new Date(t.dataVencimento) <= dataVencimentoFinal);
    }

    if (this.filterTipoPagamento) {
      filteredData = filteredData.filter(t => t.codigoCobranca.toString() === this.filterTipoPagamento);
    }

    filteredData = filteredData.filter(item => {
      return (item.situacao === 'A VENCER' && this.checkedAVencer) ||
        (item.situacao === 'VENCIDOS' && this.checkedVencido) ||
        (item.situacao === 'BAIXADO' && this.checkedBaixado);
    });


    this.setDataSource(filteredData);
  }

  private setDataSource(titulos: Titulo[]) {
    this.dataSource = new MatTableDataSource(titulos);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

}

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  Inject
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Oferta } from '@shared/models';
import { ProdutoService } from '@shared/services';

@Component({
  selector: 'app-oferta-popup',
  templateUrl: './oferta-popup.component.html',
  styleUrls: ['./oferta-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfertaPopUpComponent implements AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Input() nomeProduto: string = '';
  @Input() codigoProduto: string = '';
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  public page: number = 0;
  public pageSize: number = 4;
  public dataSource!: MatTableDataSource<Oferta>;
  public displayedColumns = ['dataInicio', 'dataFim', 'desconto', 'qtdMinima', 'qtdMaxima', 'aplicaDesconto'];

  constructor(
    private produtoService: ProdutoService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.produtoService.getOfertas(
      data.codigoUnidade,
      data.codigoProduto,
      data.codigoCliente,
      data.codigoRegiao,
      data.ufCliente,
      data.codigoAtividade,
      data.codigoRede,
      data.codigoRCA,
      data.codigoSupervisor,
      data.codigoPlanoPagamento,
    ).subscribe((oferta) => {
      this.dataSource = new MatTableDataSource(oferta);

      if (!oferta) return;

      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  ngAfterViewInit(): void {

    if (!this.dataSource || !this.dataSource.data) return;

    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  onCloseModal(): void {
    this.closeModal.emit();
  }
}

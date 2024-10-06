import { AfterViewInit, Component, EventEmitter, Inject, OnDestroy, Output, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { MixIdeal } from 'src/app/shared/models/mix-ideal';

@Component({
  selector: 'app-mix-ideal-popup',
  templateUrl: './mix-ideal-popup.component.html',
  styleUrls: ['./mix-ideal-popup.component.scss']
})
export class MixIdealPopupComponent implements AfterViewInit, OnDestroy {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  public page: number = 0;
  public pageSize: number = 8;
  public searchTerm: string = '';
  public dataSource!: MatTableDataSource<MixIdeal>;
  public displayedColumns = ['codigoproduto', 'descricaoproduto', 'embalagem', 'quantidadefaturada', 'ultimopreco', 'participacao'];

  private mixidealitens: MixIdeal[] = [];

  private _subs: Subscription[] = [];


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    if (data.mixidealitens) {
      this.mixidealitens = data.mixidealitens;
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.setDataSource(this.mixidealitens);
    });
  }

  ngOnDestroy(): void {
    this._subs.forEach((sub: Subscription) => sub.unsubscribe());
  }

  onCloseModal(): void {
    this.closeModal.emit();
  }


  private setDataSource(mixideal: MixIdeal[]) {
    const orderedMixIdeal = mixideal.sort((a, b) => b.participacao - a.participacao);
    this.dataSource = new MatTableDataSource(orderedMixIdeal);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

}

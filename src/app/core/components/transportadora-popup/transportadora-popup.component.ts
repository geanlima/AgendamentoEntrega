import { AfterViewInit, Component, EventEmitter, Inject, OnDestroy, Output, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Cliente } from '@shared/models';
import { DialogService, StorageService } from '@shared/services';
import { Subject, Subscription } from 'rxjs';
import { Transportadora } from 'src/app/shared/models/transportadora';
import { TransportadoraService } from 'src/app/shared/services/transportadora.service';

@Component({
  selector: 'app-transportadora-popup',
  templateUrl: './transportadora-popup.component.html',
  styleUrls: ['./transportadora-popup.component.scss']
})
export class TransportadoraPopupComponent implements AfterViewInit, OnDestroy{

  constructor(
    private _transportadoraService: TransportadoraService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();
  
  private resultSubject = new Subject<Transportadora>(); // Sujeito para emitir valores
  result$ = this.resultSubject.asObservable(); // Observable para que o componente pai possa se inscrever
  
  public searchTerm: string = '';
  
  private readonly VIEW_CODE: string = 'POPUP_TRANSPORTADORA';
  private _subs: Subscription[] = [];
  public page: number = 0;
  public pageSize: number = 8;
  private transportadoras: Transportadora[] = [];
  public dataSource!: MatTableDataSource<Transportadora>;
  public displayedColumns = ['codFornec', 'fantasia'];
  
  ngAfterViewInit(): void {
    this.loadTransportadoras();
  }

  ngOnDestroy(): void {
    this._subs.forEach((sub: Subscription) => sub.unsubscribe());
  }
  
  onCloseModal(): void {
    this.closeModal.emit();
  }

  loadTransportadoras(): void{
    this._transportadoraService.getAllTransportadora().forEach(item => {
      this.dataSource = new MatTableDataSource(item);
      this.transportadoras = item;
    });
  }

  onSearchChanged(): void {

    let filteredData = this.transportadoras; 
    this.setDataSource(filteredData);
  }

  onEnterOnSearch(valor: string): void {
    
  }

  onRowClicked(transportadora: Transportadora) {
    this.resultSubject.next(transportadora);
    this.onCloseModal();
  }

  private setDataSource(transportadora: Transportadora[]) {
    this.dataSource = new MatTableDataSource(transportadora);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
}

import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ConfigTabelaPopupComponent } from '@core/components';
import { Cliente, ClienteCompleto, RamoAtuacao } from '@shared/models';
import { ClienteService, DialogService } from '@shared/services';
import { Observable, Subscription } from 'rxjs';
import { ColunasTabela } from 'src/app/shared/models/colunas-tabela';
import { Estado } from 'src/app/shared/models/estado';
import { DialogConfirmationService } from 'src/app/shared/services/dialog-confirmation.service';
import { MockService } from 'src/app/shared/services/mock.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnDestroy {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public displayedColumns = ['client_code', 'client_cnpj', 'client_fantasy_name', 'client_business_name', 'cidade_comercial_cliente', 'legenda'];
  public dataSource!: MatTableDataSource<Cliente>;
  public page: number = 0;
  public pageSize: number = 10;
  public clientes: Cliente[] = [];
  public clientesCompleto: ClienteCompleto[] = [];
  public filteredClientes: Cliente[] = [];
  public filteredClientesCompleto: ClienteCompleto[] = [];

  public ramoatuacao$!: Observable<RamoAtuacao[]>;
  public estado$!: Observable<Estado[]>;

  filterOptions = {
    cliente: '',
    ramoatuacao: '',
    uf: '',
    cidade: '',
    CNAE: '',
    checksugestadoatendimento: false,
    checknaobloquequeados: false,
    checkbloqueados: false,
    checksemrestricao: false,
    checkcomrestricao: false,
    checksemcompras: false,
    semcomprasavalor: '',
    checkclassevendaa: false,
    checkclassevendab: false,
    checkclassevendac: false,
    checkclassevendad: false,
    checkclassevendae: false,
  };

  public searchDisabled: boolean = false;

  private _subs: Subscription[] = [];

  private colunastabela: ColunasTabela[] = [
    { titulo: 'Código Cliente', nome: 'client_code', selecionado: true, editavel: true },
    { titulo: 'CNPJ/CPF', nome: 'client_cnpj', selecionado: true, editavel: true },
    { titulo: 'Nome Fantasia', nome: 'client_fantasy_name', selecionado: true, editavel: true },
    { titulo: 'Razão Social', nome: 'client_business_name', selecionado: true, editavel: true },
    { titulo: 'Cidade', nome: 'cidade_comercial_cliente', selecionado: true, editavel: true },
    { titulo: 'Legenda', nome: 'legenda', selecionado: true, editavel: true }
  ];

  constructor(
    private _clienteService: ClienteService,
    private _mockService: MockService,
    private _router: Router,
    private _dialogConfirmation: DialogConfirmationService,
    private _http: HttpClient,
    private _dialogService: DialogService,
  ) {
    this.ramoatuacao$ = this._http.get<RamoAtuacao[]>('./../assets/data/ramotatuacaocliente.json');
    this.estado$ = this._http.get<Estado[]>('./../assets/data/estado.json');
    this.loadClientes();
  }

  ngOnDestroy(): void {
    this._subs.forEach((sub: Subscription) => sub.unsubscribe());
  }

  private setDataSource(clientes: Cliente[]) {
    this.dataSource = new MatTableDataSource(clientes);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  private loadClientes(): void {

    const subs = this._clienteService.getAllClientesFull().subscribe((clientes) => {
      console.log("clientes", clientes)
      this.clientesCompleto = clientes;
      this.filteredClientesCompleto = this.clientesCompleto;

      this.onSearchChanged();
    });

    this._subs.push(subs);
  }

  onSearchChanged(): void {
    this.filteredClientesCompleto = this.clientesCompleto.filter(cliente => {
      // Filtro por nome ou código de cliente
      const matchCliente = this.filterOptions.cliente
        ? cliente.fantasia_cliente.toLowerCase().includes(this.filterOptions.cliente.toLowerCase()) || 
          cliente.codigo_cliente.toString().includes(this.filterOptions.cliente)
        : true;
  
      // Filtro por cidade
      const matchCidade = this.filterOptions.cidade
        ? cliente.cidade_comercial_cliente.toLowerCase().includes(this.filterOptions.cidade.toLowerCase())
        : true;
  
      // Filtro por CNAE
      const matchCNAE = this.filterOptions.CNAE
        ? cliente.codigo_cnae_cliente && cliente.codigo_cnae_cliente.toString().includes(this.filterOptions.CNAE)
        : true;
  
      // Filtro por ramo de atuação
      /*const matchRamoAtuacao = this.filterOptions.ramoatuacao
        ? cliente.ramo && cliente.ramo_atuacao.toString().includes(this.filterOptions.ramoatuacao)
        : true;*/
  
      // Filtro por estado (UF)
      const matchUF = this.filterOptions.uf
        ? cliente.uf_comercial_cliente.toLowerCase().includes(this.filterOptions.uf.toLowerCase())
        : true;
  
      // Filtros booleanos
      /*const matchSugestadoAtendimento = this.filterOptions.checksugestadoatendimento
        ? cliente.sugestadoatendimento === this.filterOptions.checksugestadoatendimento
        : true;
  
      const matchNaoBloqueados = this.filterOptions.checknaobloquequeados
        ? cliente.bloqueado === false
        : true;
  
      const matchBloqueados = this.filterOptions.checkbloqueados
        ? cliente.bloqueado === true
        : true;
  
      const matchSemRestricao = this.filterOptions.checksemrestricao
        ? cliente.restricao === false
        : true;
  
      const matchComRestricao = this.filterOptions.checkcomrestricao
        ? cliente.restricao === true
        : true;
  
      const matchSemCompras = this.filterOptions.checksemcompras
        ? cliente.valor_compras === 0 || cliente.valor_compras <= +this.filterOptions.semcomprasavalor
        : true;
  
      // Filtro por classe de venda (A, B, C, D, E)
      const matchClasseVenda = 
        (this.filterOptions.checkclassevendaa && cliente.classe_venda === 'A') ||
        (this.filterOptions.checkclassevendab && cliente.classe_venda === 'B') ||
        (this.filterOptions.checkclassevendac && cliente.classe_venda === 'C') ||
        (this.filterOptions.checkclassevendad && cliente.classe_venda === 'D') ||
        (this.filterOptions.checkclassevendae && cliente.classe_venda === 'E') || 
        !(this.filterOptions.checkclassevendaa || this.filterOptions.checkclassevendab || this.filterOptions.checkclassevendac || this.filterOptions.checkclassevendad || this.filterOptions.checkclassevendae);
  
      // Retornar true se todos os filtros corresponderem
      return matchCliente && matchCidade && matchCNAE && matchRamoAtuacao && matchUF && 
             matchSugestadoAtendimento && matchNaoBloqueados && matchBloqueados &&
             matchSemRestricao && matchComRestricao && matchSemCompras && matchClasseVenda;*/
    });
  
    // Atualiza o dataSource da tabela
    this.setDataSource(this.filteredClientes);
  }
  

  onSearchChangedCliente(searchTerm: string): void {
    
    this.filterOptions.cliente = searchTerm;
  }

  onSearchChangedCidade(searchTerm: string): void {
    this.filterOptions.cidade = searchTerm;
  }

  onSearchChangedCNAE(searchTerm: string): void {
    this.filterOptions.CNAE = searchTerm;
  }

  onEnterOnSearch(valor: string) {

  }

  onClearFilters(): void {

    this.filterOptions = {
      cliente: '',
      ramoatuacao: '',
      uf: '',
      cidade: '',
      CNAE: '',
      checksugestadoatendimento: false,
      checknaobloquequeados: false,
      checkbloqueados: false,
      checksemrestricao: false,
      checkcomrestricao: false,
      checksemcompras: false,
      semcomprasavalor: '',
      checkclassevendaa: false,
      checkclassevendab: false,
      checkclassevendac: false,
      checkclassevendad: false,
      checkclassevendae: false,
    };

    this.filteredClientes = this.clientes;

    this.onSearchChanged();
  }

  compareSelect(object1: any, object2: any) {
    return object1 && object2 && object1.id == object2.id;
  }



  configTabela() {
    const modalConfigTabela = this._dialogService.show(ConfigTabelaPopupComponent,
      { colunas: this.colunastabela },
      [],
      true,
      true,
      '500px',
      '350px'
    );

    modalConfigTabela.componentInstance.closeModal.subscribe((colunas) => {
      if (colunas.length > 0) {
        this.colunastabela = colunas;
        this.displayedColumns = this.colunastabela
          .filter(coluna => coluna.selecionado)
          .map(coluna => coluna.nome);
      }

      this._dialogService.close(modalConfigTabela);
    });
  }
}

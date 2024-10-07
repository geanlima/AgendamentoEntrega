import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Categoria, Departamento, Filtro, Marca, Secao, SubCategoria } from '@shared/models';
import { CategoriaService, DepartamentoService, MarcaService, SecaoService, SubCategoriaService } from '@shared/services';
import { Subscription } from 'rxjs';
import { Regiao } from 'src/app/shared/models/Regiao';
import { PlanoPagamento } from 'src/app/shared/models/venda';
import { PlanoPagamentoService } from 'src/app/shared/services/planopagamento.service';
import { RegiaoService } from 'src/app/shared/services/regiao.service';
import { Fornecedor } from 'src/app/shared/models/fornecedor';
import { FornecedorService } from 'src/app/shared/services/fornecedor.service';

@Component({
  selector: 'app-filtro-atendimento',
  templateUrl: './filtro-atendimento.component.html',
  styleUrls: ['./filtro-atendimento.component.scss']
})
export class FiltroAtendimentoComponent implements OnDestroy {
  @Output() searchChanged = new EventEmitter<string>();
  @Output() filterChanged = new EventEmitter<Filtro>();
  @Output() clearFilters = new EventEmitter<Filtro>();
  @Output() onPesquisarClick = new EventEmitter<Filtro>();
  @Output() enterOnSearch = new EventEmitter<string>();
  @Input() modoConsulta = false;
  public searchDisabled: boolean = false;

  public filtro: Filtro = { hasEstoque: "S" } as Filtro;

  public codigoPlanoPagamento: number = 0;

  public searchTerm: string = '';
  public prioridade: boolean = false;
  public emPromocao: boolean = false;
  public comEstoque: boolean = true;
  public mixCliente: boolean = false;

  public departamentoModel = {} as Departamento;
  public secaoModel = {} as Secao;
  public categoriaModel = {} as Categoria;
  public subCategoriaModel = {} as SubCategoria;
  public marcaModel = {} as Marca;
  public regiaoModel = {} as Regiao;
  public planoPagamentoModel = {} as PlanoPagamento;
  secoes: Secao[] = [];
  marcas: Marca[] = [];
  categorias: Categoria[] = [];
  fornecedores: Fornecedor[] = [];
  subCategorias: SubCategoria[] = [];
  departamentos: Departamento[] = [];
  regioes: Regiao[] = [];
  planoPagamentos: PlanoPagamento[] = [];

  clonedSecoes: string = '';
  clonedCategoria: string = '';
  clonedSubCategoria: string = '';


  private _subs: Subscription[] = [];

  constructor(
    private secaoService: SecaoService,
    private marcasService: MarcaService,
    private categoriaService: CategoriaService,
    private fornecedorService: FornecedorService,
    private subCategoriaService: SubCategoriaService,
    private departamentoService: DepartamentoService,
    private regiaoService: RegiaoService,
    private planoPagamentoService: PlanoPagamentoService,
  ) {
    //TODO: Converter para switmap ou finalize, realiza Loading em cascata para evitar erro 429
    this.resetFilters();
    this.loadSecao();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.searchDisabled = this.modoConsulta;
    });
  }

  ngOnDestroy(): void {
    this._subs.forEach((sub: Subscription) => sub.unsubscribe());
  }

  onEnterOnSearch(valor: string) {
    this.enterOnSearch.emit(valor);
  }

  private loadSecao() {
    const subs = this.secaoService.getAll<Secao[]>()
      .subscribe((secoes: Secao[]) => {
        this.secoes.push({ codigosecao: -1, descricaosecao: 'Todos', codigodepartamento: -1 });
        this.secoes.push(...secoes);
        this.clonedSecoes = JSON.stringify(this.secoes);
        this.loadMarca();
      });
    this._subs.push(subs);
  }

  private loadMarca() {
    const subs = this.marcasService.getAll<Marca[]>()
      .subscribe((marcas: Marca[]) => {
        this.marcas.push({ codigo_marca_produto: '-1', descricao_marca_produto: 'Todos' });
        this.marcas.push(...marcas);
        this.loadCategoria();
      });
    this._subs.push(subs);
  }

  private loadCategoria() {
    const subs = this.categoriaService.getAll<Categoria[]>()
      .subscribe((categorias: Categoria[]) => {

        this.categorias.push({ codigo_categoria: -1, descricao_categoria: 'Todos', codigo_sessao: -1 });
        this.categorias.push(...categorias);
        this.clonedCategoria = JSON.stringify(this.categorias);
        this.loadSubCategoria();
      });
    this._subs.push(subs);
  }

  private loadSubCategoria() {
    const subs = this.subCategoriaService.getAll<SubCategoria[]>()
      .subscribe((subCategorias: SubCategoria[]) => {
        this.subCategorias.push({ codigosubcategoria: -1, descricaosubcategoria: 'Todos', codigosessao: -1, codigocategoria: -1 });
        this.subCategorias.push(...subCategorias);
        this.clonedSubCategoria = JSON.stringify(this.subCategorias);
        this.loadDepartamento();
      });
    this._subs.push(subs);
  }

  private loadDepartamento() {
    const subs = this.departamentoService.getAll<Departamento[]>()
      .subscribe((departamentos: Departamento[]) => {
        this.departamentos.push({ codigo_departamento: -1, descricao_departamento: 'Todos' } as Departamento);
        this.departamentos.push(...departamentos);
        this.loadFornecedor();
      });
  }

  private loadFornecedor() {
    const subs = this.fornecedorService.getAll<Fornecedor[]>()
      .subscribe((fornecedores: Fornecedor[]) => {
        this.fornecedores.push({ codigo: '-1', razao_social: 'Todos', fantasia: 'Todos' });
        this.fornecedores.push(...fornecedores);
        this.loadRegiao();
      });
    this._subs.push(subs);
  }

  private loadRegiao() {
    const subs = this.regiaoService.getAll<Regiao[]>()
      .subscribe((regioes: Regiao[]) => {
        this.regioes = regioes;
        this.loadPlanoPagamento();
      });
    this._subs.push(subs);
  }

  private loadPlanoPagamento() {
    const subs = this.planoPagamentoService.getAllPlanoPagamento()
      .subscribe((planoPagamentos: PlanoPagamento[]) => {
        this.planoPagamentos = planoPagamentos;
      });

    this._subs.push(subs);
  }

  onSearchChanged(searchTerm: string): void {

    this.searchTerm = searchTerm;
    this.filtro.searchTerm = this.searchTerm;
    this.filterChanged.emit(this.filtro);
    this.searchChanged.emit(searchTerm);
  }

  onClearFilters(): void {
    this.searchTerm = '';
    this.prioridade = false;
    this.emPromocao = false;
    this.comEstoque = true;
    this.mixCliente = false;
    this.departamentoModel = {} as Departamento;
    this.secaoModel = {} as Secao;
    this.categoriaModel = {} as Categoria;
    this.subCategoriaModel = {} as SubCategoria;
    this.marcaModel = {} as Marca;
    this.regiaoModel = {} as Regiao;
    this.planoPagamentoModel = {} as PlanoPagamento;
    this.codigoPlanoPagamento = 0;
    this.resetFilters();
    if (!this.modoConsulta) {
      this.searchChanged.emit();
    } else {
      this.clearFilters.emit(this.filtro);
    }
  }

  onChangePrioridade(): void {
    this.prioridade = !this.prioridade;
    this.filtro.hasPrioridadeVenda = this.prioridade ? 'S' : 'N';
    this.filterChanged.emit(this.filtro);
  }

  onChangeEmPromocao(): void {
    this.emPromocao = !this.emPromocao;
    this.filtro.hasPromocao = this.emPromocao ? 'S' : 'N';
    this.filterChanged.emit(this.filtro);
  }

  onChangeComEstoque(): void {
    this.comEstoque = !this.comEstoque;
    this.filtro.hasEstoque = this.comEstoque ? 'S' : 'N';
    this.filterChanged.emit(this.filtro);
  }

  onChangeMixCliente(): void {
    this.mixCliente = !this.mixCliente;
    this.filtro.hasMixCliente = this.mixCliente ? 'S' : 'N';
    this.filterChanged.emit(this.filtro);
  }

  updateFilter(): void {
    this.filtro.acrescimo_desconto_maximo = this.getAcrescimoDescontoMaximo();

    this.filtro.codigoPlanoPagamento = this.codigoPlanoPagamento;

    this.filterChanged.emit(this.filtro);
  }

  getAcrescimoDescontoMaximo(): number {
    let acrescimoDescontoMaximo = 0;

    if (this.codigoPlanoPagamento) {
      const planopagamento = this.planoPagamentos.find(p => p.codigo_plano_pagamento == this.codigoPlanoPagamento)
      if (planopagamento) {
        acrescimoDescontoMaximo = planopagamento.acrescimo_desconto_maximo;
      }
    }
    return acrescimoDescontoMaximo;
  }

  onPesquisar(): void {
    this.onPesquisarClick.emit(this.filtro);
    this.searchDisabled = false;
  }

  private resetFilters(): void {
    this.filtro.searchTerm = '';
    this.filtro.codigoRegiao = 0;
    this.filtro.acrescimo_desconto_maximo = 0;
    this.filtro.codigoDepartamento = '-1';
    this.filtro.codigoSecao = '-1';
    this.filtro.codigoCategoria = '-1';
    this.filtro.codigoSubCategoria = '-1';
    this.filtro.codigoMarca = '-1';
    this.filtro.codigoFornecedor = '-1';
    this.filtro.codigoPlanoPagamento = 0;
  }

  updateFilterDepartamento(): void {

    const clone = JSON.parse(this.clonedSecoes) as Secao[];

    if (this.filtro.codigoDepartamento.toString() === '-1') {
      this.secoes = clone;
      this.categorias = JSON.parse(this.clonedCategoria) as Categoria[];
      this.subCategorias = JSON.parse(this.clonedSubCategoria) as SubCategoria[];
      this.filtro.codigoSecao = '-1';
      this.filtro.codigoCategoria = '-1';
      this.filtro.codigoSubCategoria = '-1';
    } else {
      this.secoes = clone.filter((secao: Secao) => {
        return secao.codigodepartamento.toString().includes(this.filtro.codigoDepartamento) ||
          secao.codigodepartamento.toString().includes('-1');
      });
    }


    this.filterChanged.emit(this.filtro);
  }

  updateFilterSecao(): void {
    const cloneCategoria = JSON.parse(this.clonedCategoria) as Categoria[];
    const cloneSubCategoria = JSON.parse(this.clonedSubCategoria) as SubCategoria[];


    if (this.filtro.codigoSecao.toString() === '-1') {
      this.categorias = cloneCategoria
      this.subCategorias = cloneSubCategoria;
      this.filtro.codigoCategoria = '-1';
      this.filtro.codigoSubCategoria = '-1';
    } else {
      this.categorias = cloneCategoria.filter((c: Categoria) => {
        return c.codigo_sessao.toString().includes(this.filtro.codigoSecao) ||
          c.codigo_sessao.toString().includes('-1');
      });

      this.subCategorias = cloneSubCategoria.filter((s: SubCategoria) => {
        return s.codigosessao.toString().includes(this.filtro.codigoSecao) ||
          s.codigocategoria.toString().includes('-1');
      });
    }

    this.filterChanged.emit(this.filtro);
  }

  updateFilterCategoria(): void {
    const clone = JSON.parse(this.clonedSubCategoria) as SubCategoria[];

    if (this.filtro.codigoCategoria.toString() === '-1') {
      this.subCategorias = clone;
      this.filtro.codigoSubCategoria = '-1';
    } else {
      this.subCategorias = clone.filter((s: SubCategoria) => {
        return (s.codigocategoria.toString().includes(this.filtro.codigoCategoria) && s.codigosessao.toString().includes(this.filtro.codigoSecao)) ||
          s.codigocategoria.toString().includes('-1');
      });
    }

    this.filterChanged.emit(this.filtro);
  }

  compareSelect(object1: any, object2: any) {
    return object1 && object2 && object1.id == object2.id;
  }
}

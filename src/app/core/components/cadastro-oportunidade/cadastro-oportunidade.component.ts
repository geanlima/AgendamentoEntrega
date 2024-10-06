import { Component, EventEmitter, Inject, OnDestroy, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TypeToast } from '@shared/enums';
import { Produto } from '@shared/models';
import { NotificationService, OportunidadeService, ProdutoService } from '@shared/services';
import { Observable, Subscription, map, startWith } from 'rxjs';
import { Oportunidade } from 'src/app/shared/models/oportunidade';

@Component({
  selector: 'app-cadastro-oportunidade',
  templateUrl: './cadastro-oportunidade.component.html',
  styleUrls: ['./cadastro-oportunidade.component.scss']
})
export class CadastroOportunidadeComponent implements OnDestroy {

  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  public oportunidadeForm!: FormGroup;

  tipos: string[] = ['Produto', 'Campanha', 'Serviço de Merchandising'];
  tipoSelecionado: string = '';

  filteredOptionsProdutos: Observable<Produto[]> | undefined;
  produtos: Produto[] = [];

  private codigoCliente: number = 0;
  private codigoRca: string = '';
  private codigoUnidade: string = '';
  private regiaoCliente: number = 0;
  private codigoProduto: number = 0;
  private descrisaoProdutoSalvar: string = '';

  private _subs: Subscription[] = [];

  constructor(

    private _formBuilder: FormBuilder,
    private _produtoService: ProdutoService,
    private _oportunidadeService: OportunidadeService,
    private _notificationService: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.createForm();

    if (data.codigoCliente) {

      this.codigoCliente = data.codigoCliente;
      this.codigoRca = data.codigoRca;
      this.codigoUnidade = data.codigoUnidade;
      this.regiaoCliente = data.regiaoCliente;

      const subs = this._produtoService.getProdutos(
        this.codigoUnidade,
        this.codigoCliente,
        0,
        this.regiaoCliente
      ).subscribe((produtos: Produto[]) => {

        this.produtos = produtos;

        this.createFilterOptons();
      });

      this._subs.push(subs);
    }
  }

  private createFilterOptons(): void {
    this.filteredOptionsProdutos = this.oportunidadeForm.controls['descricaoProduto'].valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value
      )),
      map(descricao_produto => (descricao_produto ? this._filterProduto(descricao_produto) : this.produtos.slice())),
    );
  }


  public onSelectionProdutoChanged(event: any): void {
    if (event) {
      this.codigoProduto = event.option.value.codigo_produto;
      this.descrisaoProdutoSalvar = event.option.value.descricao_produto;
      this.oportunidadeForm.patchValue({
        descricaoProduto: this.descrisaoProdutoSalvar,
      });
    }
  }


  private _filterProduto(value: string): Produto[] {
    if (value && typeof value === 'string') {
      const filterValue = value.toLowerCase();

      let buscas = filterValue.split(' ');

      var produtosFiltro = this.produtos;

      buscas.forEach(element => {
        produtosFiltro &&= produtosFiltro.filter(produtos => produtos.descricao_produto.toLowerCase().includes(element));
      });

      return produtosFiltro;
    } else {
      return this.produtos;
    }
  }


  ngOnDestroy(): void {
    this._subs.forEach((sub: Subscription) => sub.unsubscribe());
  }

  onCloseModal(): void {
    this.closeModal.emit();
  }

  private createForm(): void {
    this.oportunidadeForm = this._formBuilder.group({
      tipo: [''],
      descricao: [''],
      observacao: [''],
      descricaoProduto: ['']
    });
  }

  onTipoChanged(event: any) {
    if (event) {
      this.tipoSelecionado = event.value;
      if (this.tipoSelecionado !== 'Produto') {
        this.codigoProduto = 0;
        this.descrisaoProdutoSalvar = '';
        this.oportunidadeForm.patchValue({
          descricaoProduto: undefined,
        });
      }
    }
  }

  addOportunidade(oportunidadeForm: any): void {

    if (!this.validarCadastro) {
      return;
    }

    const codigoProduto = oportunidadeForm.tipo === 'Produto' ? this.codigoProduto : undefined;
    const descricao = oportunidadeForm.tipo === 'Produto' ? this.descrisaoProdutoSalvar : oportunidadeForm.descricao;

    const novaOportunidade: Oportunidade = {
      idoportunidade: 0,
      tipo: oportunidadeForm.tipo[0],
      codigo: codigoProduto,
      descricao: descricao,
      observacao: oportunidadeForm.observacao,
      codigoCliente: this.codigoCliente,
      codigoUnidade: this.codigoUnidade,
      codigoRca: +this.codigoRca,
      status: 'A',
    };

    const subs = this._oportunidadeService.saveOportunidade(novaOportunidade).subscribe((oportunidade) => {
      this.closeModal.emit();
    });

    this._subs.push(subs);
  }

  private validarCadastro(oportunidadeForm: any): boolean {
    if (oportunidadeForm.tipo === undefined) {
      this._notificationService.showToast(
        {
          message: "Tipo é obrigatório.",
          typeToast: TypeToast.WARNING,
        }
      );
      return false;
    }

    if (this.tipoSelecionado === 'Produto' && this.codigoProduto === 0) {
      this._notificationService.showToast(
        {
          message: "Selecione um produto.",
          typeToast: TypeToast.WARNING,
        }
      );
      return false;
    }
    else {
      if (oportunidadeForm.descricao === undefined) {
        this._notificationService.showToast(
          {
            message: "Descrição é obrigatória.",
            typeToast: TypeToast.WARNING,
          }
        );
        return false;
      }
    }

    return true;
  }
}



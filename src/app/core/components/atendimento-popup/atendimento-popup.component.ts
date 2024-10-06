import { AfterViewInit, Component, EventEmitter, OnDestroy, Output, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Cliente } from '@shared/models';
import { StorageService } from '@shared/services';
import { ClienteService } from 'src/app/shared/services/cliente.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { DialogConfirmationService } from 'src/app/shared/services/dialog-confirmation.service';
import { environment } from '@env';


@Component({
  selector: 'app-atendimento-popup',
  templateUrl: './atendimento-popup.component.html',
  styleUrls: ['./atendimento-popup.component.scss']
})
export class AtendimentoPopupComponent implements AfterViewInit, OnDestroy { //AfterContentInit,
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  private _subs: Subscription[] = [];

  private readonly VIEW_CODE: string = 'POPUP_ATENDIMENTO';

  public page: number = 0;
  public pageSize: number = 8;
  public searchTerm: string = '';
  public dataSource!: MatTableDataSource<Cliente>;
  public displayedColumns = ['client_code', 'client_cnpj', 'client_fantasy_name', 'client_business_name', 'client_uf', 'client_cidade', 'client_bairro', 'dataultimopedido', 'legenda'];

  constructor(
    private storageService: StorageService,
    private _clienteService: ClienteService,
    private _router: Router,
    private _dialogConfirmationService: DialogConfirmationService,
  ) { }

  ngAfterViewInit(): void {
    this.loadClientes();
  }


  ngOnDestroy(): void {
    this._subs.forEach((sub: Subscription) => sub.unsubscribe());
  }

  onCloseModal(): void {
    this.closeModal.emit();
  }

  onEnterOnSearch(valor: string): void {
    
  }

  onSearchChanged(searchTerm: string): void {
    this.storageService.saveSearchFilter(this.VIEW_CODE, searchTerm);
    this.dataSource.filter = searchTerm;
  }

  onRowClicked(cliente: Cliente) {
    //TODO: Validar se atendimento em andamento e alertar usuário    

    const subs = this._clienteService.getPainelAtendimento(cliente.client_code, +environment.unidade).subscribe((painelAtendimento) => {
      this.storageService.savePainelAtendimento(painelAtendimento[0]);
      this._router.navigate(['/home/painel-atendimento']);
      this.closeModal.emit();
    });

    this._subs.push(subs);

    //    //TODO: Validar se atendimento em andamento e alertar usuário

    //    // Cliente tem bloqueio definitivo
    //    if (cliente.bloqueio_definitivo === 'S') {
    //      // Verifica se permite vender para cliente com bloqueio definitivo
    //      const progress = this._dialogService.showProgress(ProgressComponent);

    //      const subs = this._parametroService.getParametro(99, "VENDE_CLIENTE_BLOQ_DEFINITIVO").subscribe((parametro) => {
    //        this._dialogService.close(progress);

    //        if (parametro && parametro.valor_parametro !== 'S') {
    //          this._dialogConfirmationService.openDialog({
    //            header: 'Falha',
    //            message: 'Não é permitido venda para cliente com Bloqueio Definitivo',
    //            txtAct: 'Ok',
    //          });
    //          return;
    //        }

    //        this.iniciaVenda(cliente);
    //      });

    //      return;
    //    }

    //    this.iniciaVenda(cliente);
  }

  // private iniciaVenda(cliente: Cliente): void {
  //   this.storageService.removeClienteCompleto();
  //   this.storageService.removeVendaCompleta();

  //   this._router.navigate(['/home/atendimento-novo', cliente.client_code]);
  //   this.closeModal.emit();
  // }

  private loadClientes(): void {
    const subs = this._clienteService.getAllClientes().subscribe((clientes) => {
      this.setDataSource(clientes);
      this.setFilter();
    });

    this._subs.push(subs);
  }

  private setDataSource(clientes: Cliente[]) {
    this.dataSource = new MatTableDataSource(clientes);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  private setFilter(): void {
    this.searchTerm = this.storageService.getSearchFilter(this.VIEW_CODE);
    if (this.searchTerm) {
      this.dataSource.filter = this.searchTerm;
    }
  }

  // Função para validar CNPJ
  validarCNPJ(cnpj: string): boolean {
    cnpj = cnpj.replace(/[^\d]+/g, '');

    if (cnpj == '') return false;

    if (cnpj.length != 14) return false;

    // Validação do primeiro dígito verificador
    var soma = 0;
    for (var i = 0; i < 12; i++) {
      soma += parseInt(cnpj.charAt(i)) * (6 + 2 * (i % 8));
    }
    var dv1 = 11 - (soma % 11);
    if (dv1 > 9) dv1 = 0;
    if (dv1 != parseInt(cnpj.charAt(12))) return false;

    // Validação do segundo dígito verificador
    soma = 0;
    for (var i = 0; i < 13; i++) {
      soma += parseInt(cnpj.charAt(i)) * (5 + 3 * (i % 8));
    }
    var dv2 = 11 - (soma % 11);
    if (dv2 > 9) dv2 = 0;
    if (dv2 != parseInt(cnpj.charAt(13))) return false;

    return true;
  }

  // Função para validar CPF
  validarCPF(cpf: string): boolean {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf == '') return false;
    if (cpf.length != 11) return false;

    // Validação do primeiro dígito verificador
    var soma = 0;
    for (var i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    var resto = soma % 11;
    var dv1 = resto < 2 ? 0 : 11 - resto;
    if (dv1 != parseInt(cpf.charAt(9))) return false;

    // Validação do segundo dígito verificador
    soma = 0;
    for (var i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = soma % 11;
    var dv2 = resto < 2 ? 0 : 11 - resto;
    if (dv2 != parseInt(cpf.charAt(10))) return false;

    return true;
  }
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@shared/modules';
import { MatCardModule } from '@angular/material/card';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MtxTooltipModule } from '@ng-matero/extensions/tooltip';

import {
  ValidadeComponent,
  OfertaPopUpComponent,
  FilialRetiraComponent,
  TipoEntregaComponent,
  InformacaoProdutoComponent,
  ProdutoPopupComponent,
  TipoEntregaPopupComponent,
  ValidadePopupComponent,
  InclusaoProdutoComponent,
  AtendimentoPopupComponent,
  DescricaoProdutoComponent,
  ConfigTabelaPopupComponent
} from '@core/components';

import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { ProcessPopupComponent } from 'src/app/core/components/process-popup/process-popup.component';
import { InclusaoAgendamentoComponent } from 'src/app/core/components/inclusao-agendamento/inclusao-agendamento.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { PedidoFornecedorComponent } from 'src/app/core/components/pedido-fornecedor/pedido-fornecedor.component';

@NgModule({
  declarations: [
    HomeComponent,
    ValidadeComponent,
    FilialRetiraComponent,
    TipoEntregaComponent,
    OfertaPopUpComponent,
    InformacaoProdutoComponent,
    ProdutoPopupComponent,
    TipoEntregaPopupComponent,
    ValidadePopupComponent,
    InclusaoProdutoComponent,
    AtendimentoPopupComponent,
    DescricaoProdutoComponent,
    ConfigTabelaPopupComponent,
    ProcessPopupComponent,
    InclusaoAgendamentoComponent,
    PedidoFornecedorComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatSortModule,
    MatTableModule,
    HomeRoutingModule,
    MatPaginatorModule,
    MtxTooltipModule,
    SharedModule,
    MatDatepickerModule,   
    MatInputModule,        
    MatNativeDateModule
  ]
})
export class HomeModule { }

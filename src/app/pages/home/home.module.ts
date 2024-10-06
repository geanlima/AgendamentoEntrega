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
  ConfigTabelaPopupComponent,
} from '@core/components';

import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { ProcessPopupComponent } from 'src/app/core/components/process-popup/process-popup.component';

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
    ProcessPopupComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatSortModule,
    MatTableModule,
    HomeRoutingModule,
    MatPaginatorModule,
    MtxTooltipModule,
    SharedModule
  ]
})
export class HomeModule { }

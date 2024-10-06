import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@shared/modules';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';


import { ProdutoRoutingModule } from './produto-routing.module';
import { ProdutoComponent } from './produto.component';
import { RodapeProdutoComponent } from './components/rodape-produto/rodape-produto.component';
import { FiltroAtendimentoComponent } from '@core/components';
import { ProdutoConsultaComponent } from './produto-consulta/produto-consulta.component';

import { MtxTooltipModule } from '@ng-matero/extensions/tooltip';


@NgModule({
  declarations: [
    ProdutoComponent,
    RodapeProdutoComponent,
    FiltroAtendimentoComponent,
    ProdutoConsultaComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatIconModule,
    MatMenuModule,
    MatTableModule,
    MatButtonModule,
    MatSelectModule,
    MatDividerModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatFormFieldModule,
    ProdutoRoutingModule,
    MtxTooltipModule,
  ]
})
export class ProdutoModule { }

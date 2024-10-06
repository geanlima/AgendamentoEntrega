import { NgModule } from '@angular/core';
import { PainelAtendimentosComponent } from './painel-atendimentos.component';
import { PainelAtendimentosRoutingModule } from './painel-atendimentos-routing.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from '@shared/modules';
import { AtendimentoSacComponent, CadastroOportunidadeComponent, DevolucoesPopupComponent, HistoricoCobrancaComponent, HistoricoPedidosComponent, ItemHistoricoPopupComponent, TitulosPopupComponent } from '@core/components'; import { MixIdealPopupComponent } from 'src/app/core/components/mix-ideal-popup/mix-ideal-popup.component';
import { TransportadoraPopupComponent } from 'src/app/core/components/transportadora-popup/transportadora-popup.component';

@NgModule({
  imports: [
    SharedModule,
    MatInputModule,
    MatFormFieldModule,
    PainelAtendimentosRoutingModule,
  ],
  declarations: [
    PainelAtendimentosComponent,
    TitulosPopupComponent,
    MixIdealPopupComponent,
    DevolucoesPopupComponent,
    HistoricoPedidosComponent,
    ItemHistoricoPopupComponent,
    CadastroOportunidadeComponent,
    AtendimentoSacComponent,
    HistoricoCobrancaComponent,
    TransportadoraPopupComponent,
  ],
})
export class PainelAtendimentosModule { }

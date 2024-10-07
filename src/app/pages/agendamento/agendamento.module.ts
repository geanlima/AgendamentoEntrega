import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/modules';
import { AgendamentoRoutingModule } from './agendamento-routing.module';
import { AgendamentoComponent } from './agendamento.component';

@NgModule({
  imports: [
    SharedModule,
    AgendamentoRoutingModule,
  ],
  declarations: [AgendamentoComponent]
})

export class AgendamentoModule { }

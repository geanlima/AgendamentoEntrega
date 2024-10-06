import { NgModule } from '@angular/core';
import { AtendimentosComponent } from './atendimentos.component';
import { SharedModule } from '@shared/modules';
import { AtendimentosRoutingModule } from './atendimentos-routing.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  imports: [
    SharedModule,
    MatInputModule,
    MatFormFieldModule,
    AtendimentosRoutingModule
  ],
  declarations: [
    AtendimentosComponent
  ]
})
export class AtendimentosModule { }

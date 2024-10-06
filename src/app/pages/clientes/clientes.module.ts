import { NgModule } from '@angular/core';
import { ClientesComponent } from './clientes.component';
import { ClientesRoutingModule } from './clientes-routing.module';
import { SharedModule } from '@shared/modules';
import { MtxTooltipModule } from '@ng-matero/extensions/tooltip';

@NgModule({
  imports: [
    SharedModule,
    ClientesRoutingModule,
    MtxTooltipModule,
  ],
  declarations: [ClientesComponent]
})
export class ClientesModule { }

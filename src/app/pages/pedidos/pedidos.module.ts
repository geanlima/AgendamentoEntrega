import { NgModule } from '@angular/core';
import { PedidosComponent } from './pedidos.component';
import { SharedModule } from '@shared/modules';
import { PedidosRoutingModule } from './pedidos-routing.module';

@NgModule({
  imports: [
    SharedModule,
    PedidosRoutingModule,
  ],
  declarations: [PedidosComponent]
})
export class PedidosModule { }

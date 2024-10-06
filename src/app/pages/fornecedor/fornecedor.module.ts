import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/modules';
import { FornecedorRoutingModule } from './fornecedor-routing.module';
import { FornecedorComponent } from './fornecedor.component';

@NgModule({
  imports: [
    SharedModule,
    FornecedorRoutingModule,
  ],
  declarations: [FornecedorComponent]
})
export class FornecedorModule { }

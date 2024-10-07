import { NgModule } from '@angular/core';
import { EmpresaComponent } from './empresa.component';
import { SharedModule } from '@shared/modules';
import { EmpresaRoutingModule } from './empresa-routing.module';

@NgModule({
  imports: [
    SharedModule,
    EmpresaRoutingModule,
  ],
  declarations: [EmpresaComponent]
})

export class EmpresaModule { }

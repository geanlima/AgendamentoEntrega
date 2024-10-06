import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProdutoComponent } from './produto.component';
import { ProdutoConsultaComponent } from './produto-consulta/produto-consulta.component';

const routes: Routes = [
  {
    path: '', component: ProdutoComponent,

  }, { path: 'consulta', component: ProdutoConsultaComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProdutoRoutingModule { }

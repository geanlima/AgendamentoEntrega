import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PainelAtendimentosComponent } from './painel-atendimentos.component';

const routes: Routes = [
  { path: '', component: PainelAtendimentosComponent },
  { path: '', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PainelAtendimentosRoutingModule { }

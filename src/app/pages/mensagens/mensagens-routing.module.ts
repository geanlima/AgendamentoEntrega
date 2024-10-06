import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MensagensComponent } from './mensagens.component';

const routes: Routes = [
  { path: '', component: MensagensComponent },
  { path: '', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MensagensRoutingModule { }

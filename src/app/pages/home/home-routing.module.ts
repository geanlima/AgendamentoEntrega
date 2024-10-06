import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';

const routes: Routes = [
  {
    path: '', component: HomeComponent,
    children: [
      { path: 'dashboard', loadChildren: () => import('../dashboard/dashboard.module').then(m => m.DashboardModule), },
      { path: 'mensagens/:idmensagem', loadChildren: () => import('../mensagens/mensagens.module').then(m => m.MensagensModule), },
      { path: 'produto', loadChildren: () => import('../produto/produto.module').then(m => m.ProdutoModule) },
      { path: 'produto/:idvenda', loadChildren: () => import('../produto/produto.module').then(m => m.ProdutoModule) },
      { path: 'atendimento/:idvenda/:backtodash', loadChildren: () => import('../atendimentos/atendimentos.module').then(m => m.AtendimentosModule) },
      { path: 'atendimento-novo/:idcliente/:backtodash', loadChildren: () => import('../atendimentos/atendimentos.module').then(m => m.AtendimentosModule) },
      { path: 'atendimento-edit/:idvenda', loadChildren: () => import('../atendimentos/atendimentos.module').then(m => m.AtendimentosModule) },
      { path: 'painel-atendimento', loadChildren: () => import('../painel-atendimentos/painel-atendimentos.module').then(m => m.PainelAtendimentosModule) },
      { path: 'pedidos', loadChildren: () => import('../pedidos/pedidos.module').then(m => m.PedidosModule), },
      { path: 'clientes', loadChildren: () => import('../clientes/clientes.module').then(m => m.ClientesModule), },
      { path: 'empresa', loadChildren: () => import('../empresa/empresa.module').then(m => m.EmpresaModule), },
      { path: 'fornecedor', loadChildren: () => import('../fornecedor/fornecedor.module').then(m => m.FornecedorModule), },
      { path: 'agendamento', loadChildren: () => import('../agendamento/agendamento.module').then(m => m.AgendamentoModule), },
    ]
  },
  { path: '', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }

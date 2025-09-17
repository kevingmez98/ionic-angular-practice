import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';
const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'summary',
        loadComponent: () => import('../../summary/summary.page').then(m => m.SummaryPage)
      },
      {
        path: 'users',
        loadComponent: () => import('../../users/users.page').then(m => m.UsersPage)
      },
      {
        path: 'providers',
        loadComponent: () => import('../../providers/providers.page').then(m => m.ProvidersPage)
      },
      {
        path: 'provider/:id', // Parámetro dinámico (:id) para pasar el ID del proveedor
        loadComponent: () => import('../../providers/pages/provider-detail/provider-detail.page').then(m => m.ProviderDetailPage)
      },
      {
        path: '',
        redirectTo: 'summary',
        pathMatch: 'full'
      }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule { }

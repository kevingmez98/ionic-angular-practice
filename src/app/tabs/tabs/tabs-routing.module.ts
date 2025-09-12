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

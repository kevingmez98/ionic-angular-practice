import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuLayoutPage } from './menu-layout.page';
const routes: Routes = [
  {
    path: '',
    component: MenuLayoutPage,
    children: [
      {
        path: '',
        loadChildren: () => import('../../../tabs/tabs/tabs.module').then(m => m.TabsPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuLayoutPageRoutingModule { }

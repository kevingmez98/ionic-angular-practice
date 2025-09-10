import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuLayoutPage } from './menu-layout.page';
const routes: Routes = [
  {
    path: '',
    component: MenuLayoutPage,
        children: [
      {
        path: 'users',
        loadChildren: () => import('../../../users/users.module').then(m => m.UsersPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuLayoutPageRoutingModule {}

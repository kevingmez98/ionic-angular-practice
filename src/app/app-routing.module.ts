import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

const routes: Routes = [
  // Rutas públicas (sin menú)
  {
    path: 'home', // Ruta a la qué se llegará
    loadChildren: () =>// Cargar solo cuando se acceda a la ruta (lazy loading)
      import('./home/home.module')
        .then(m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full' // Redireccionar solo si el path es exacto
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  // Rutas privadas (con menú)
  {
    path: '',
    loadChildren: () => import('../app/shared/layouts/menu-layout/menu-layout.module').then(m => m.MenuLayoutPageModule),
    canActivate: [authGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, // Definir como rutas principales del proyecto
      { preloadingStrategy: PreloadAllModules })  // Lazy loading
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/welcome',
  },
  {
    path: 'welcome',
    pathMatch: 'full',
    loadComponent: () => import('./pages/main-page/main-page.component').then(m => m.MainPageComponent),
  },
  {
    path: 'lobby',
    pathMatch: 'full',
    loadChildren: () => import('./pages/lobby/lobby.routes').then(m => m.routes),
  },
  {
    path: '**',
    redirectTo: 'welcome',
  },
  // {
  //     path: 'main',
  //     pathMatch: 'full',
  //     loadChildren: () => import('./user/user.routes').then(mod => mod.routes),
  // },
];

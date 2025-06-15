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
  }
  // {
  //     path: 'main',
  //     pathMatch: 'full',
  //     loadChildren: () => import('./user/user.routes').then(mod => mod.routes),
  // },
  // {
  //   path: '*',
  //   redirectTo: '',
  // },
];

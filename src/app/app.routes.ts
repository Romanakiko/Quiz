import { Routes } from '@angular/router';
import {MainPageComponent} from './main-page/main-page.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/welcome',
  },
  {
    path: 'welcome',
    pathMatch: 'full',
    loadComponent: () => import('./main-page/main-page.component').then(m => m.MainPageComponent),
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

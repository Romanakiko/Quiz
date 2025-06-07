import { Routes } from '@angular/router';
import {MainPageComponent} from './main-page/main-page.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/main',
  },
  {
    path: 'main',
    pathMatch: 'full',
    component: MainPageComponent
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

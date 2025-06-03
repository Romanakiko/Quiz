import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/user',
  },
  {
      path: 'user',
      pathMatch: 'full',
      loadChildren: () => import('./user/user.routes').then(mod => mod.routes),
  },
  // {
  //   path: '*',
  //   redirectTo: '',
  // },
];

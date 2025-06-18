import { Routes } from '@angular/router';
import {LobbyComponent} from './lobby.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: LobbyComponent,
  },
  // {
  //   path: 'folder/{id}',
  //   pathMatch: 'full',
  //   component: FolderComponent,
  // }
];

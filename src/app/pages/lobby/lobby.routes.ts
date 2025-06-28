import { Routes } from '@angular/router';
import {LobbyComponent} from './lobby.component';
import {FolderComponent} from './folder/folder.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: LobbyComponent,
  },
  {
    path: 'folder/:id',
    component: FolderComponent,
  }
  // {
  //   path: 'folder/{id}',
  //   pathMatch: 'full',
  //   component: FolderComponent,
  // }
];

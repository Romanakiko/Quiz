import { Routes } from '@angular/router';
import {LobbyComponent} from './lobby.component';
import {FolderComponent} from './folder/folder.component';

export const routes: Routes = [
  {
    path: '',
    component: LobbyComponent,
  },
  {
    path: 'folder/new',
    component: FolderComponent,
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

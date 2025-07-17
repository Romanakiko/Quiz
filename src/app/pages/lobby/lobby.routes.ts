import { Routes } from '@angular/router';
import {LobbyComponent} from './lobby.component';
import {FolderComponent} from './folder/folder.component';
import {GameComponent} from './game/game.component';
import {NewQuestionComponent} from './folder/new-question/new-question.component';

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
    path: 'folder/:folder_id',
    component: FolderComponent,
  },
  {
    path: 'question/new',
    component: NewQuestionComponent,
  },
  {
    path: 'question/:question_id',
    component: NewQuestionComponent,
  },
  {
    path: 'game/new',
    component: GameComponent,
  },
  {
    path: 'game/:game_id',
    component: GameComponent,
  }
  // {
  //   path: 'folder/{id}',
  //   pathMatch: 'full',
  //   component: FolderComponent,
  // }
];

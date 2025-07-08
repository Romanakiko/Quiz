import {Component, computed, inject} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {FolderService} from '../../folder/folder.service';
import {GameService} from '../../game/game.service';
import {TableComponent} from '../../ui/table/table.component';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-lobby',
  imports: [
    MatIcon,
    TableComponent,
    RouterLink
  ],
  providers: [FolderService, GameService],
  templateUrl: './lobby.component.html',
  styleUrl: './lobby.component.scss'
})
export class LobbyComponent {

  private folderService = inject(FolderService);
  private gameService = inject(GameService);

  folders = computed(() => this.folderService.userFolders() ?? undefined);
  games = computed(() => this.gameService.userGames() ?? undefined);

  constructor() {}
}

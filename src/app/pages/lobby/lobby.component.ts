import {Component, computed, inject} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {FolderService} from '../../folder/folder.service';
import {GameService} from '../../game/game.service';
import {TableComponent} from '../../ui/table/table.component';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-lobby',
  imports: [
    MatIcon,
    TableComponent,
    RouterLink
  ],
  providers: [GameService],
  templateUrl: './lobby.component.html',
  styleUrl: './lobby.component.scss'
})
export class LobbyComponent {

  private folderService = inject(FolderService);
  private gameService = inject(GameService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  folders = computed(() => this.folderService.userFolders.value() ?? undefined);
  games = computed(() => this.gameService.userGames() ?? undefined);

  foldersTableLink(id: string): void {
    this.router.navigate(['folder', id], { relativeTo: this.activatedRoute});
  }
}

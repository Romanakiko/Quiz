import {inject, Injectable, signal} from '@angular/core';
import {HeaderService} from '../header/header.service';
import {SupabaseService} from '../supabase/supabase.service';
import {UserService} from '../user/user.service';
import {Folder} from '../folder/folder';
import {GameStatus, GameTypes} from './game';

@Injectable()
export class GameService {

  private headerService = inject(HeaderService);
  private supabaseService = inject(SupabaseService);
  private userService = inject(UserService);

  constructor() {
    this.getGames().then(games => {});
  }

  userFolders = signal<Folder[] | null>(null);

  private async getGames(): Promise<void> {
    try {
      this.headerService.loading.set(true);
      const { data, error } = await this.supabaseService.getOwnRows(this.userService.userInfo()?.email ?? '', 'Game');
      if (error) throw error;

      this.userFolders.set(
        data?.map(element => ({
          id: element.id,
          name: element.full_name || '',
          createdAt: new Date(element.created_at),
          owner_id: element.owner_id,
          status: element.status as GameStatus,
          type: element.status as GameTypes,
          description: element.description,
          fail_weight: element.fail_weight,
          timer: element.timer,
          show_answer_status: element.show_answer_status,
          show_answers: element.show_answers,
          standalone: element.standalone,
        }))
      );
      console.log("(FolderService) UserFolders=", this.userFolders());
    } catch (error) {
      console.log("FolderError=", error);
      if (error instanceof Error) {
        console.error(error.message);
      }
    } finally {
      this.headerService.loading.set(false);
    }
  }
}

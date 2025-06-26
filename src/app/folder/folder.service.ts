import {inject, Injectable, signal} from '@angular/core';
import {HeaderService} from '../header/header.service';
import {IUser} from '../user/user';
import {Folder} from './folder';
import {SupabaseService} from '../supabase/supabase.service';
import {UserService} from '../user/user.service';

@Injectable()
export class FolderService {

  private headerService = inject(HeaderService);
  private supabaseService = inject(SupabaseService);
  private userService = inject(UserService);

  constructor() {
    this.getFolders().then(folders => {})
  }

  userFolders = signal<Folder[] | null>(null);

  private async getFolders(): Promise<void> {
    try {
      this.headerService.loading.set(true);
      const { data, error } = await this.supabaseService.getOwnRows(this.userService.userInfo()?.email ?? '', 'Folder');
      if (error) throw error;

      this.userFolders.set(
        data?.map(element => ({
          id: element.id,
          name: element.full_name || '',
          createdAt: new Date(element.created_at)
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

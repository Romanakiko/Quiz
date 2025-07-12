import {inject, Injectable, resource, signal} from '@angular/core';
import {HeaderService} from '../header/header.service';
import {Folder} from './folder';
import {SupabaseService} from '../supabase/supabase.service';
import {UserService} from '../user/user.service';
import {IUser} from '../user/user';

@Injectable({
  providedIn: 'root'
})
export class FolderService {

  private headerService = inject(HeaderService);
  private supabaseService = inject(SupabaseService);
  private userService = inject(UserService);

  constructor() {
  }

  userFolders = resource<Folder[] | null, { user: IUser | null }>({
    defaultValue: null,
    params: (): { user: IUser | null } => ({
      user: this.userService.userInfo()
    }),
    loader: async (param): Promise<Folder[] | null> => {
      await this.getFolders(param.params.user?.email ?? '');
      return this.userFolders.value();
    }
  });

  private async getFolders(email: string): Promise<void> {
    try {
      this.headerService.loading.set(true);
      const { data, error } = await this.supabaseService.getOwnRows(email, 'Folder');
      if (error) throw error;

      this.userFolders.set(
        data?.map(element => ({
          id: element.id,
          name: element.name || '',
          createdAt: new Date(element.created_at)
        }))
      );
      console.log("(FolderService) UserFolders=", this.userFolders.value());
    } catch (error) {
      console.log("FolderError=", error);
      if (error instanceof Error) {
        console.error(error.message);
      }
    } finally {
      this.headerService.loading.set(false);
    }
  }

  async getFolderById(folder_id: string): Promise<Folder | null> {
    try {
      this.headerService.loading.set(true);
      const {data, error} = await this.supabaseService.getOwnRowById("Folder", folder_id);
      if (error) throw error;

      let currentFolder = data?.map<Folder>(element => ({
        id: element.id,
        name: element.name || '',
        createdAt: new Date(element.created_at)
      }))[0];
      console.log("(FolderService) CurrentFolder=", data);
      return currentFolder;
    } catch (error) {
      console.log("GetFolderError=", error);
      if (error instanceof Error) {
        console.error(error.message);
      }
      return null;
    } finally {
      this.headerService.loading.set(false);
    }
  }

  async newFolder(name: string): Promise<Folder | null> {
    try {
      this.headerService.loading.set(true);
      const {data, error} = await this.supabaseService.newFolder(this.userService.userInfo()?.id ?? '', this.userService.userInfo()?.email ?? '', name);
      if (error) throw error;

      let newFolder = data?.map<Folder>(element => ({
        id: element.id,
        name: element.name || '',
        createdAt: new Date(element.created_at)
      }))[0];
      this.userFolders.update( (folders) => (folders ? [ ...folders,newFolder ] : [newFolder] ));
      console.log("(FolderService) NewFolder=", data);
      return newFolder;
    } catch (error) {
      console.log("NewFolderError=", error);
      if (error instanceof Error) {
        console.error(error.message);
      }
      return null;
    } finally {
      this.headerService.loading.set(false);
    }
  }

  async changeName(name: string, folder_id: string): Promise<Folder | null> {
    try {
      this.headerService.loading.set(true);
      const {data, error} = await this.supabaseService.changeRow("Folder", folder_id, {'name': name});
      if (error) throw error;
      let newFolder = data?.map<Folder>(element => ({
        id: element.id,
        name: element.name || '',
        createdAt: new Date(element.created_at)
      }))[0];
      this.userFolders.update( (folders) => (folders ? [ ...folders,newFolder ] : [newFolder] ));
      console.log("(FolderService) NewFolder=", data);
      return newFolder;
    } catch (error) {
      console.log("NewFolderError=", error);
      if (error instanceof Error) {
        console.error(error.message);
      }
      return null;
    } finally {
      this.headerService.loading.set(false);
    }
  }
}

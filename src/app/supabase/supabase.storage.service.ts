import {inject, Injectable, signal} from '@angular/core';
import {SupabaseService} from './supabase.service';
import {HeaderService} from '../header/header.service';
import {UserService} from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class SupabaseStorageService {

  supabaseService = inject(SupabaseService);
  headerService = inject(HeaderService);
  userService = inject(UserService);

  errorMessage = signal<string | null>(null)
  constructor() {  }

  async ChangeAvatar(event: Event) {
    this.errorMessage.set(null);
    const user = this.userService.userInfo();
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    if (!file.type.match('image.*')) {
      this.errorMessage.set('Only image types allowed');
      return;
    }
    if (!user) {
      this.errorMessage.set('No user found');
      return;
    }

    try {
      this.headerService.loading.set(true);
      this.errorMessage.set(null);

      const newAvatarUrl = await this.supabaseService.uploadAvatar(user.id, file);

      if (user.avatar && user.avatar !== "") {
        await this.supabaseService.deleteOldAvatar(user.avatar);
      }

      this.userService.optimisticUpdateAvatar(newAvatarUrl);

    } catch (error: any) {
      this.errorMessage.set("Uploading failed");
      console.error('Upload error:', error);
    } finally {
      this.headerService.loading.set(false);
      if (input) input.value = '';
    }
  }
}

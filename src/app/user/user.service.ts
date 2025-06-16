import {inject, Injectable, OnDestroy, signal} from '@angular/core';
import {AuthService} from './auth/auth.service';
import {IUser} from './user';
import {Subscription} from 'rxjs';
import {HeaderService} from '../header/header.service';
import {SupabaseService} from '../supabase/supabase.service';

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnDestroy{

  private headerService = inject(HeaderService);
  private supabaseService = inject(SupabaseService);

  isLoggedIn = signal<boolean>(false);
  userInfo = signal<IUser | null>(null);
  private sessionSubscription: Subscription | null = null;

  authService = inject(AuthService);
  constructor() {
    this.sessionSubscription = this.authService.$session.subscribe(session => {
      if (session) {
        this.isLoggedIn.set(true);
        this.getUser().then(r => {});
      } else {
        this.isLoggedIn.set(false);
      }
    })
  }

  private async getUser(retry: boolean = true): Promise<void> {
    try {
      this.headerService.loading.set(true);
      const { data, error }: { data: IUser | null; error: any } = await this.supabaseService.getUser();
      if (error) throw error;
      this.userInfo.set(data);
      console.log("(UserService) Userinfo=", this.userInfo());
    } catch (error) {
      console.log("UserError=", error);
      await this.createUser();
      if(retry) {
        await this.getUser(false);
      }
      if (error instanceof Error) {
        console.error(error.message);
      }
    } finally {
      this.headerService.loading.set(false);
    }
  }

  private async createUser(): Promise<void> {
    try {
      this.headerService.loading.set(true);
      const { error } = await this.supabaseService.createUser();
      if (error) throw error;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    } finally {
      this.headerService.loading.set(false);
    }
  }

  async optimisticUpdateAvatar(avatar: string) {
    this.userInfo.update(user => ({
      avatar: avatar,
      email: user?.email ?? "",
      name: user?.name ?? "",
      createdAt: user?.createdAt ?? new Date(),
      id: user?.id ?? ""
    }))
    if(this.userInfo()?.id && this.userInfo()?.id !== "") {
      const user = await this.supabaseService.updateProfile(this.userInfo()?.id!, {avatar: this.userInfo()?.avatar});
      console.log('New user data: ', user);
    }
  }

  ngOnDestroy(): void {
        this.sessionSubscription?.unsubscribe();
    }
}

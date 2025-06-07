import {inject, Injectable, OnDestroy} from '@angular/core';
import {SupabaseService} from '../../supabase/supabase.service';
import {HeaderService} from '../../header/header.service';
import {BehaviorSubject, Subscription} from 'rxjs';
import {SocialAuthService} from '@abacritt/angularx-social-login';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {

  private supabaseService = inject(SupabaseService);
  private headerService = inject(HeaderService);
  private googleAuthService = inject(SocialAuthService)
  private googleAuthSub: Subscription | null = null;
  $session = new BehaviorSubject(this.supabaseService.session)

  constructor() {
    this.supabaseService.authChanges((_, session) => {
      this.$session.next(session)
      console.log('auth successfull', session)
      if(!session) {
        this.googleAuthSub = this.googleAuthService.authState.subscribe((user) => {
          if(user) {
            console.log('user-info state changed', user);
            this.signInWithGoogle(user.idToken);
          }
        });
      } else {
        this.googleAuthSub?.unsubscribe();
        this.googleAuthSub = null;
      }
    });
  }

  async signUp(email: string, password: string): Promise<void> {
    try {
      this.headerService.loading.set(true);
      const { error } = await this.supabaseService.signUpWithEmail(email, password);
      if (error) throw error;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    } finally {
      this.headerService.loading.set(true);
    }
  }

  async signIn(email: string, password: string): Promise<void> {
    try {
      this.headerService.loading.set(true);
      const { error } = await this.supabaseService.signInWithEmail(email, password);
      if (error) throw error;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    } finally {
      this.headerService.loading.set(true);
    }
  }

  async signOut(): Promise<void> {
    try {
      this.headerService.loading.set(true);
      const { error } = await this.supabaseService.signOut();
      if (error) throw error;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    } finally {
      this.headerService.loading.set(true);
    }
  }

  async signInWithGoogle(token: string) {
    try {
      const { data, error } = await this.supabaseService.signInWithGoogle(token);
      if (error) throw error;
      console.log('user-info auth in supabase succeed', data);
    } catch (error) {
      console.log('user-info auth in supabase get error', error);
    } finally {
      await this.supabaseService.createUser();
    }
  }

  ngOnDestroy(): void {
    this.googleAuthSub?.unsubscribe();
  }

}

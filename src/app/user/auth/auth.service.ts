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
  private isLoggedIn = false

  constructor() {
    this.supabaseService.authChanges((_, session) => {
      this.$session.next(session)
      console.log('auth successfull', session)
      if(!session && !this.isLoggedIn) {
        this.googleAuthSub = this.googleAuthService.authState.subscribe((user) => {
          if(user) {
            console.log('user state changed', user);
            this.signInWithGoogle(user.idToken);
          }
        });
      } else {
        this.googleAuthSub?.unsubscribe();
        this.googleAuthSub = null;
      }
    });
  }

  private async doSignUp(email: string, password: string): Promise<void> {
    try {
      this.headerService.loading.set(true);
      const { error } = await this.supabaseService.signUpWithEmail(email, password);
      if (error) throw error;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    } finally {
      this.headerService.loading.set(false);
    }
  }

  private async doSignIn(email: string, password: string): Promise<void> {
    try {
      this.headerService.loading.set(true);
      const { error } = await this.supabaseService.signInWithEmail(email, password);
      if (error) throw error;
      this.isLoggedIn = true;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    } finally {
      this.headerService.loading.set(false);
    }
  }

  private async doSignInWithGoogle(token: string) {
    try {
      this.headerService.loading.set(true);
      const { data, error } = await this.supabaseService.signInWithGoogle(token);
      if (error) throw error;
      await this.supabaseService.createUser();
      this.isLoggedIn = true;
      console.log('user auth in supabase succeed', data);
    } catch (error) {
      console.log('user auth in supabase get error', error);
    } finally {
      this.headerService.loading.set(false);
    }
  }


  private async doSignOut(): Promise<void> {
    try {
      this.headerService.loading.set(true);
      const { error } = await this.supabaseService.signOut();
      if (error) throw error;
      this.$session.next(null);
      this.isLoggedIn = false;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    } finally {
      this.headerService.loading.set(false);
    }
  }

  public signIn(email: string, password: string): void {
    this.doSignIn(email, password).then(() => {});
  }
  public signUp(email: string, password: string): void {
    this.doSignUp(email, password).then(() => {});
  }

  public signInWithGoogle(token: string): void {
    this.doSignInWithGoogle(token).then(() => {});
  }

  public signOut(): void {
    this.doSignOut().then(() => {});
  }


  ngOnDestroy(): void {
    this.googleAuthSub?.unsubscribe();
  }

}

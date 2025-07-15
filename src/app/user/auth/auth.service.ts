import {inject, Injectable, OnDestroy, signal} from '@angular/core';
import {SupabaseService} from '../../supabase/supabase.service';
import {HeaderService} from '../../header/header.service';
import {BehaviorSubject, Subscription} from 'rxjs';
import {SocialAuthService} from '@abacritt/angularx-social-login';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {

  private supabaseService = inject(SupabaseService);
  private headerService = inject(HeaderService);
  private googleAuthService = inject(SocialAuthService)
  private router = inject(Router);
  private googleAuthSub: Subscription | null = null;
  private isLoggedIn = false

  $session = new BehaviorSubject(this.supabaseService.session);
  errorMessage = signal<string | null>(null);

  constructor() {
    this.supabaseService.authChanges((_, session) => {
      this.$session.next(session)
      if(!session && !this.isLoggedIn) {
        this.googleAuthSub = this.googleAuthService.authState.subscribe((user) => {
          if(user) {
            console.log('google-user state changed', user);
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
      this.signIn(email, password)
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        this.errorMessage.set(error.message);
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
      this.errorMessage.set(null);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        this.errorMessage.set(error.message);
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
      this.isLoggedIn = true;
      console.log('user auth in supabase succeed', data);
      this.errorMessage.set(null);
    } catch (error) {
      if (error instanceof Error) {
        console.log('user auth in supabase get error', error);
        this.errorMessage.set(error.message);
      }
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
      this.errorMessage.set(null);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        this.errorMessage.set(error.message);
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
    this.router.navigate(['/']).then(r => {});
  }


  ngOnDestroy(): void {
    this.googleAuthSub?.unsubscribe();
  }

}

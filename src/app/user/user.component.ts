import {Component, inject, OnInit} from '@angular/core';
import {SupabaseService} from '../supabase/supabase.service';
import {AuthComponent} from './auth/auth.component';
import {UserPageComponent} from './user-page/user-page.component';
import {BehaviorSubject, Subscription} from 'rxjs';
import {AsyncPipe} from '@angular/common';
import {SocialAuthService} from "@abacritt/angularx-social-login";

@Component({
  selector: 'app-user',
  imports: [
    AuthComponent,
    UserPageComponent,
    AsyncPipe
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent implements OnInit {
  private supabase = inject(SupabaseService)
  private googleAuthService = inject(SocialAuthService)

  session = new BehaviorSubject(this.supabase.session)
  googleAuthSub: Subscription | null = null;

  constructor() {}

  ngOnInit() {
    console.log('User component loaded', this.session);
    console.log('Get session in user component', this.supabase.session);
    this.supabase.authChanges((_, session) => {
      this.session.next(session)
      console.log('auth successfull', session)
      if(!session) {
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
  async signInWithGoogle(token: string) {
    try {
      const { data, error } = await this.supabase.signInWithGoogle(token);
      if (error) throw error;
      console.log('user auth in supabase succeed', data);
    } catch (error) {
      console.log('user auth in supabase get error', error);
    } finally {
      await this.supabase.createUser();
    }
  }
}

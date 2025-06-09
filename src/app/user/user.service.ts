import {inject, Injectable, OnDestroy, signal} from '@angular/core';
import {AuthService} from './auth/auth.service';
import {User} from './user';
import {Subscription} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnDestroy{
  isLoggedIn = signal<boolean>(false);
  userInfo = signal<User | null>(null);
  private sessionSubscription: Subscription | null = null;

  authService = inject(AuthService);
  constructor() {
    this.sessionSubscription = this.authService.$session.subscribe(session => {
      if (session) {
        this.isLoggedIn.set(true);
        if(session.user)
        this.userInfo.set({
          id: session.user.id ?? "",
          name: session.user.user_metadata['name'] ?? "",
          email: session.user.email ?? ""
        });
        console.log("Userinfo=",this.userInfo())
      } else {
        this.isLoggedIn.set(false);
      }
    })
  }

  ngOnDestroy(): void {
        this.sessionSubscription?.unsubscribe();
    }
}

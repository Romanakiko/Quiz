import {Component, inject, OnInit} from '@angular/core';
import {SupabaseService} from '../supabase/supabase.service';
import {AuthComponent} from './auth/auth.component';
import {UserPageComponent} from './user-page/user-page.component';
import {BehaviorSubject} from 'rxjs';
import {AsyncPipe} from '@angular/common';

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

  session = new BehaviorSubject(this.supabase.session)

  constructor() {}

  ngOnInit() {
    console.log('User component loaded', this.session);
    console.log('Get session in user component', this.supabase.session);
    this.supabase.authChanges((_, session) => {
      this.session.next(session)
      console.log('auth successfull', session)
    })
  }
}

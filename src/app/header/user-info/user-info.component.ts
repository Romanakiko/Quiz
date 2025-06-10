import {Component, computed, inject, OnInit, Signal} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatDialog} from '@angular/material/dialog';
import {AuthComponent} from '../../user/auth/auth.component';
import {AuthService} from '../../user/auth/auth.service';
import {UserService} from '../../user/user.service';
import {MatMenu, MatMenuContent, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';

@Component({
  selector: 'app-user-info',
  imports: [
    MatButton,
    MatIcon,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    MatMenuContent
  ],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.scss'
})
export class UserInfoComponent {

  readonly dialog = inject(MatDialog);
  private userService = inject(UserService);
  private authService = inject(AuthService);

  isLoggedIn = this.userService.isLoggedIn;
  user = this.userService.userInfo;
  username: Signal<string | undefined> = computed(() => !this.user()?.name || this.user()?.name === '' ? this.user()?.email : this.user()?.name);

  openDialog(): void {
    const dialogRef = this.dialog.open(AuthComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // if (result !== undefined) {
      //   this.animal.set(result);
      // }
    });

  }

   signOut(): void {
     this.authService.signOut();
  }
}

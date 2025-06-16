import {Component, computed, inject, OnInit, Signal} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatDialog} from '@angular/material/dialog';
import {AuthComponent} from '../../user/auth/auth.component';
import {AuthService} from '../../user/auth/auth.service';
import {UserService} from '../../user/user.service';
import {MatMenu, MatMenuContent, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {RouterLink} from '@angular/router';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {UserDetailsComponent} from '../../user/user-details/user-details.component';
import {AvatarComponent} from '../../ui/avatar/avatar.component';

@Component({
  selector: 'app-user-info',
  imports: [
    MatButton,
    MatIcon,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    MatMenuContent,
    AvatarComponent
  ],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.scss'
})
export class UserInfoComponent {

  readonly dialog = inject(MatDialog);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private _bottomSheet = inject(MatBottomSheet);

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


  openUserDetails(): void {
    this._bottomSheet.open(UserDetailsComponent);
  }

   signOut(): void {
     this.authService.signOut();
  }
}

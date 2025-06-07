import {Component, inject} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatDialog} from '@angular/material/dialog';
import {AuthComponent} from '../../user/auth/auth.component';
import {AuthService} from '../../user/auth/auth.service';
import {AsyncPipe} from '@angular/common';
import {map, tap} from 'rxjs';

@Component({
  selector: 'app-user-info',
  imports: [
    MatButton,
    MatIcon,
    AsyncPipe
  ],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.scss'
})
export class UserInfoComponent {
  readonly dialog = inject(MatDialog);
  private authService = inject(AuthService);

  session = this.authService.$session;
  email: string | undefined = undefined;

  openDialog(): void {
    const dialogRef = this.dialog.open(AuthComponent);
    this.session.subscribe(session => {
      if (session) {this.dialog.closeAll()};
      this.email = session?.user.email;
    })

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // if (result !== undefined) {
      //   this.animal.set(result);
      // }
    });

  }
}

import {Component, computed, inject, Signal} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatMenu, MatMenuContent, MatMenuItem} from "@angular/material/menu";
import {UserService} from '../user.service';
import {IUser} from '../user';
import {MatBottomSheetRef} from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-user-details',
    imports: [
    ],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss'
})
export class UserDetailsComponent {
  private userService = inject(UserService);
  private _bottomSheetRef =
    inject<MatBottomSheetRef<UserDetailsComponent>>(MatBottomSheetRef);

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }

  userInfo: Signal<IUser | null> = computed(this.userService.userInfo);
}

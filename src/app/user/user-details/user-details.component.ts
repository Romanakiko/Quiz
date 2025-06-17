import {Component, computed, inject, linkedSignal, signal, Signal} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatMenu, MatMenuContent, MatMenuItem} from "@angular/material/menu";
import {UserService} from '../user.service';
import {IUser} from '../user';
import {MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {AvatarComponent} from '../../ui/avatar/avatar.component';
import {SupabaseStorageService} from '../../supabase/supabase.storage.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {EditableTextComponent} from "../../ui/editable-text/editable-text.component";

@Component({
  selector: 'app-user-details',
  imports: [
    AvatarComponent,
    EditableTextComponent
  ],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss'
})
export class UserDetailsComponent {
  private _snackBar = inject(MatSnackBar);
  private userService = inject(UserService);
  private supabaseStorageService = inject(SupabaseStorageService);
  private _bottomSheetRef =
    inject<MatBottomSheetRef<UserDetailsComponent>>(MatBottomSheetRef);

  userInfo: Signal<IUser | null> = computed(this.userService.userInfo);
  errors = linkedSignal({
    source: this.supabaseStorageService.errorMessage,
    computation: (message) => {
      if(message && message !== "") {
          this._snackBar.open(message, "ok");
      }
      return message;
}
  })

  async onFileSelected(event: Event) {
    await this.supabaseStorageService.ChangeAvatar(event);
  }

  async changeName(name: string) {
    await this.userService.optimisticUpdateName(name);
  }

}

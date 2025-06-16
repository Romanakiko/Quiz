import {Component, input, Signal} from '@angular/core';
import {IUser} from '../../user/user';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-avatar',
  imports: [
    MatIcon,
  ],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss'
})
export class AvatarComponent {
  user = input<IUser | null>();
  size = input<string, number>('50px', {
    transform: (size: number) => `${size}px`
  });
  editable = input<boolean>(false);
}

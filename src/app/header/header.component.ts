import {Component, inject} from '@angular/core';
import {MatProgressBar} from "@angular/material/progress-bar";
import {HeaderService} from './header.service';
import {UserInfoComponent} from './user-info/user-info.component';

@Component({
  selector: 'app-header',
  imports: [
    MatProgressBar,
    UserInfoComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  headerService = inject(HeaderService);
  loading = this.headerService.loading;
}

import {Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  isLoggedIn = signal<boolean>(false);

  constructor() { }
}

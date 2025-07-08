import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {UserService} from './user.service';

export const authorizedGuard: CanActivateFn = (route, state) => {
  return inject(UserService).isLoggedIn() ? true : inject(Router).parseUrl('/welcome');
};

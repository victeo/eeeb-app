import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AuthService} from "../auth/auth.service";

@Injectable()
export class UserGuard implements CanActivate {
  constructor(
    private _router: Router,
    private _userService: AuthService
  ) {
  }

  canActivate() {
    let identity = this._userService.getUserData();

    if (identity != null) {
      return true;
    } else {
      this._router.navigate(['/']);
      return false;
    }
  }

}

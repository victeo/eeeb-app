import {Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import {AuthService} from "../auth/auth.service";

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private _userService: AuthService,
    private _router: Router
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    let identity = this._userService.getUserData();


    if (identity.roles.includes('admin')) {
      return true;
    }

    this._router.navigate(['/']);
    return false;
  }
}

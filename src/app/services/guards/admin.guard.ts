import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from "../auth/auth.service";

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private _userService: AuthService,
    private _router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const identity = this._userService.getUserData();

    // Verifica se o usuário possui o papel de admin
    if (identity?.roles && Array.isArray(identity.roles) && identity.roles.includes('admin')) {
      return true;
    }

    // Redireciona para a página inicial caso não seja admin
    this._router.navigate(['/']);
    return false;
  }
}

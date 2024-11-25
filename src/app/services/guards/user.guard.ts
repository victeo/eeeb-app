import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from "../auth/auth.service";

@Injectable()
export class UserGuard implements CanActivate {
  constructor(
    private _router: Router,
    private _userService: AuthService
  ) {}

  canActivate(): boolean {
    const identity = this._userService.getUserData();

    // Verifica se o usuário está autenticado
    if (identity) {
      return true;
    }

    // Redireciona para a página inicial caso não esteja autenticado
    this._router.navigate(['/']);
    return false;
  }
}

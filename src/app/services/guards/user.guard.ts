import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserGuard implements CanActivate {
  constructor(
    private _router: Router,
    private _userService: AuthService
  ) {}

  canActivate(): boolean {
    // Obtém os dados do usuário do serviço de autenticação
    const identity = this._userService.getUserData();
    console.log('UserGuard - Usuário autenticado:', identity);

    // Verifica se o usuário está autenticado
    if (identity && identity.role) {
      console.log('UserGuard - Acesso permitido:', identity.role);
      return true; // Permite o acesso
    }

    // Redireciona para a página inicial caso o usuário não esteja autenticado
    console.warn('UserGuard - Acesso negado. Redirecionando...');
    this._router.navigate(['/']);
    return false;
  }
}
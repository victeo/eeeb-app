import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('AdminGuard - Usuário atual:', user);
  
    if (user.role === 'admin') {
      console.log('AdminGuard - Acesso permitido.');
      return true;
    }
  
    console.warn('AdminGuard - Acesso negado. Redirecionando...');
    this.router.navigate(['/']);
    return false;
  }
}

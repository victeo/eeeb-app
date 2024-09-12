import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {UserCredential} from '@angular/fire/auth'; // Supondo que você esteja usando Firebase


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Armazenar o estado do login
  private isLoggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private loggedInUserData: any = null;

  constructor() {}

  // Função para verificar se está no navegador
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }
  // Salva os dados do usuário logado
  saveUserData(user: UserCredential): void {
    const userData = {
      uid: user.user?.uid,
      email: user.user?.email,
      displayName: user.user?.displayName,
      role: 'admin'
    };

    this.loggedInUserData = user;
    this.isLoggedInSubject.next(true);

    if (this.isBrowser()) { // Verifica se o localStorage está disponível
      localStorage.setItem('user', JSON.stringify(userData));
    }
  }

  // Retorna os dados do usuário logado
  getUserData(): any {
    if (this.loggedInUserData) {
      return this.loggedInUserData;
    }

    if (this.isBrowser()) { // Verifica se o localStorage está disponível
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        this.loggedInUserData = JSON.parse(storedUser);
        this.isLoggedInSubject.next(true);
      }
    }

    return this.loggedInUserData;
  }

  // Verifica se o usuário está logado
  isLoggedIn(): boolean {
    return this.isLoggedInSubject.getValue();
  }

  // Método para fazer o logout
  logout(): void {
    this.loggedInUserData = null;
    this.isLoggedInSubject.next(false);

    if (this.isBrowser()) { // Verifica se o localStorage está disponível
      localStorage.removeItem('user');
    }
  }


}

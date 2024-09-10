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


  //https://github.com/agatha-soft/angular-18-firebase-boilerplate/blob/main/src/app/services/firestorage.service.ts

  // Salva os dados do usuário logado
  saveUserData(user: UserCredential): void {
    this.loggedInUserData = user;
    this.isLoggedInSubject.next(true); // Atualiza o estado para logado
    localStorage.setItem('user', JSON.stringify(user)); // Salva os dados no localStorage (opcional)
  }

  // Retorna os dados do usuário logado
  getUserData(): any {
    if (this.loggedInUserData) {
      return this.loggedInUserData;
    }
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.loggedInUserData = JSON.parse(storedUser);
      this.isLoggedInSubject.next(true);
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
    localStorage.removeItem('user'); // Remove os dados do localStorage
  }


}

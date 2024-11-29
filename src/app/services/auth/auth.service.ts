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
  saveUserData(user: UserCredential, userName: any, role: string = 'user'): void {
    const userData = {
      uid: user.user?.uid || null,
      email: user.user?.email || null,
      displayName: userName || "Usuario", // O nome do usuário obtido do Firestore ou um valor padrão
      role, // Papel do usuário (ex.: 'user', 'admin')
    };
  
    this.loggedInUserData = userData;
    this.isLoggedInSubject.next(true);
  
    if (this.isBrowser()) {
      localStorage.setItem('user', JSON.stringify(userData));
    }
  }
  

  // Retorna os dados do usuário logado
  getUserData(): any {
    // Retorna diretamente os dados do usuário, se já estiverem carregados na memória
    if (this.loggedInUserData) {
      return this.loggedInUserData;
    }
  
    // Verifica se está no navegador e se o localStorage está disponível
    if (this.isBrowser()) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          // Tenta parsear o JSON e carregar os dados do usuário
          this.loggedInUserData = JSON.parse(storedUser);
          this.isLoggedInSubject.next(true);
        } catch (error) {
          console.error('Erro ao parsear os dados do usuário no localStorage:', error);
          // Caso o JSON esteja corrompido ou inválido, limpa o localStorage para evitar problemas
          localStorage.removeItem('user');
          this.loggedInUserData = null;
        }
      }
    }
  
    // Retorna os dados do usuário (ou null, caso não estejam disponíveis)
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

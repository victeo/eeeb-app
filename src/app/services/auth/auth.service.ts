import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {UserCredential} from '@angular/fire/auth'; // Supondo que você esteja usando Firebase
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Armazenar o estado do login
  private isLoggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private loggedInUserData: any = null;

  constructor(private http: HttpClient) {}

  // Função para verificar se está no navegador
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }
  // Salva os dados do usuário logado
  saveUserData(user: UserCredential, userName: string, role: 'admin' | 'user' | 'professor' | 'coordination'): void {
    const userData = {
      uid: user.user?.uid || null,
      email: user.user?.email || null,
      displayName: userName || "Usuario",
      role: role,
    };
  
    this.loggedInUserData = userData;
    this.isLoggedInSubject.next(true);
  
    if (this.isBrowser()) {
      localStorage.setItem('user', JSON.stringify(userData));
    }
  }
  

  // Retorna os dados do usuário logado
  getUserData(): any {
    // Verifica se os dados do usuário já estão carregados na memória
    if (this.loggedInUserData) {
      console.log('getUserData - Dados carregados da memória:', this.loggedInUserData);
      return this.loggedInUserData;
    }
  
    // Verifica se estamos no navegador e o localStorage está disponível
    if (this.isBrowser()) {
      console.log('getUserData - Verificando localStorage para dados do usuário.');
  
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          // Parseia os dados do localStorage
          const parsedUser = JSON.parse(storedUser);
  
          // Valida se os dados possuem as propriedades esperadas
          if (parsedUser && parsedUser.role) {
            console.log('getUserData - Dados recuperados e validados do localStorage:', parsedUser);
            this.loggedInUserData = parsedUser;
            this.isLoggedInSubject.next(true);
            return parsedUser;
          } else {
            console.warn('getUserData - Dados no localStorage são inválidos ou incompletos:', parsedUser);
            localStorage.removeItem('user'); // Remove dados inválidos
          }
        } catch (error) {
          console.error('getUserData - Erro ao parsear os dados do localStorage:', error);
          // Limpa o localStorage caso os dados sejam inválidos
          localStorage.removeItem('user');
        }
      } else {
        console.warn('getUserData - Nenhum dado encontrado no localStorage.');
      }
    } else {
      console.warn('getUserData - Ambiente não suporta localStorage ou não está no navegador.');
    }
  
    // Retorna null se os dados não forem encontrados ou forem inválidos
    this.loggedInUserData = null;
    this.isLoggedInSubject.next(false);
    return null;
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

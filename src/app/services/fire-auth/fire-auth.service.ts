import { FireStorageService } from './../fire-storage/fire-storage.service';
import { Injectable } from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  User,
  UserCredential
} from '@angular/fire/auth';
import { FirestoreService } from '../fire-store/firestore.service';

import { User as UserInfo } from "../../models/user";

interface RegisterUser {
  name: string;
  role?: string; // Opcional
}

@Injectable({
  providedIn: 'root'
})
export class FireAuthService {
  private user: User | null = null;
  

  constructor(
    private auth: Auth,
    private firestoreService: FirestoreService 
  ) {
    // this.listenToAuthStateChanges();
  }

  

  /**
   * Escuta as mudanças no estado de autenticação do usuário.
   */
  public listenToAuthStateChanges(): void {
    authState(this.auth).subscribe((user: User | null) => {
      if (user) {
        console.log(user);
      } else {
        console.log('Usuário não encontrado');
      }
    });
  }

  /**
   * Registra um novo usuário com email e senha.
   * 
   * @param email O endereço de email do novo usuário.
   * @param password A senha escolhida para o novo usuário.
   * @returns A credencial do usuário registrado.
   */
  private async signUpWithEmailAndPassword(email: string, password: string): Promise<UserCredential> {
    const cred = await createUserWithEmailAndPassword(this.auth, email, password);
    if (cred?.user) {
      this.user = cred.user;
    }
    return cred;
  }

  /**
   * Faz login de um usuário existente com email e senha.
   * 
   * @param email O endereço de email do usuário.
   * @param password A senha do usuário.
   * @returns A credencial do usuário autenticado.
   */
  public async signInWithEmailAndPassword(email: string, password: string): Promise<UserCredential> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
  
      // Obtém o papel do usuário após o login
      const userRole = await this.getUserRole(userCredential.user.uid);
  
      // Armazena o papel no localStorage para facilitar a verificação de permissões
      localStorage.setItem('userRole', userRole);
  
      return userCredential;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  }  

  /**
   * Faz logout do usuário autenticado.
   */
  public async signOut(): Promise<void> {
    localStorage.removeItem('userRole'); // Remove o papel do usuário do localStorage
    await this.auth.signOut();
  }

  /**
   * Obtém o papel do usuário logado (admin ou user).
   * 
   * @param userId O ID do usuário.
   * @returns O papel do usuário.
   */
  private async getUserRole(userId: string): Promise<string> {
    try {
      const userData = await this.firestoreService.getDocument<{ role: string }>(`users/${userId}`);
      if (userData && userData.role) {
        return userData.role;
      } else {
        console.warn(`Usuário com ID ${userId} não possui um papel definido no Firestore.`);
        return 'user'; // Retorna "user" por padrão
      }
    } catch (error) {
      console.error('Erro ao obter a função do usuário:', error);
      return 'user'; // Retorna "user" em caso de erro
    }
  }

  /**
   * Verifica se o usuário atual é admin.
   * 
   * @returns Verdadeiro se for admin, falso caso contrário.
   */
  public isAdmin(): boolean {
    const userRole = localStorage.getItem('userRole');
    return userRole === 'admin';
  }

  /**
   * Verifica se o usuário atual é um usuário comum.
   * 
   * @returns Verdadeiro se for user, falso caso contrário.
   */
  public isUser(): boolean {
    const userRole = localStorage.getItem('userRole');
    return userRole === 'user';
  }

  /**
   * Obtém o nome do usuário armazenado no localStorage.
   * 
   * @returns O nome do usuário ou null.
   */
  public getUserName(): string | null {
    return localStorage.getItem('userName');
  }

  /**
   * Envia um email para redefinição de senha.
   * 
   * @param email O endereço de email do usuário.
   */
  public async sendPasswordResetEmail(email: string): Promise<void> {
    return sendPasswordResetEmail(this.auth, email);
  }

  /**
   * Registra um novo usuário e armazena informações adicionais no banco de dados.
   * 
   * @param email O endereço de email do usuário.
   * @param password A senha do usuário.
   * @param registerUser Dados adicionais do usuário.
   */
  public async register<T>(email: string, password: string, registerUser: T): Promise<UserCredential> {
    try {
      const userCredential: UserCredential = await createUserWithEmailAndPassword(this.auth, email, password);
  
      // Adiciona role "user" como padrão
      const userData = {
        ...registerUser,
        email,
        role: (registerUser as any)?.role || 'user', // Define "user" como padrão
      };
  
      console.log('Dados enviados para o Firestore:', userData); // Log para verificar
  
      // Salva no Firestore
      await this.firestoreService.createDocument(`users/${userCredential.user.uid}`, userData);
  
      return userCredential;
    } catch (error: any) {
      let errorMessage = '';
  
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = `Endereço de email: ${email} já está em uso em outra conta`;
          break;
        case 'auth/invalid-email':
          errorMessage = `O email: ${email} é inválido.`;
          break;
        case 'auth/operation-not-allowed':
          errorMessage = `O email: ${email} não é permitido.`;
          break;
        case 'auth/missing-password':
          errorMessage = `Campo da senha vazio.`;
          break;
        case 'auth/weak-password':
          errorMessage = `A senha não é forte o suficiente.`;
          break;
        default:
          errorMessage = 'Erro desconhecido ao registrar o usuário';
      }
  
      console.error("Erro ao registrar o usuário:", errorMessage);
      throw new Error(errorMessage);
    }
  }
}

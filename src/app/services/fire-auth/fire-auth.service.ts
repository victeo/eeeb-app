import { FireStorageService } from './../fire-storage/fire-storage.service';
import { Injectable } from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile,
  User,
  UserCredential
} from '@angular/fire/auth';
import { AuthService } from '../auth/auth.service';
import { environment } from 'environments/environment';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { FirestoreService } from '../fire-store/firestore.service';
import { User as UserInfo } from "../../models/user";

interface RegisterUser {
  name: string;
  role?: string; // Opcional
}

@Injectable({
  providedIn: 'root',
})
export class FireAuthService {
  private user: User | null = null;
  

  constructor(
    private auth: Auth,
    private firestoreService: FirestoreService,
    private authService: AuthService,
    private firestore: Firestore,
  ) {
    this.overrideLocalStorageSetItem()
    // this.listenToAuthStateChanges();
  }

  // Salva a função original do setItem
  private overrideLocalStorageSetItem(): void {
    if (environment.production) return; // Apenas em desenvolvimento
  
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function (key: string, value: string): void {
      console.log(`localStorage.setItem called with key: ${key}, value: ${value}`);
      if (key === 'role') {
        console.trace('Setting role in localStorage');
      }
      originalSetItem.apply(localStorage, [key, value]);
    };
  }  

  
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
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

  async signIn(email: string, password: string): Promise<void> {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const uid = userCredential.user.uid;
  
      await this.fetchAndUpdateUserRole(uid); // Atualiza os dados do usuário e da role no localStorage
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  }  

  async updateUserRoleInFirestore(uid: string, role: string): Promise<void> {
    try {
      const validRoles = ['admin', 'user', 'professor', 'coordination']; // Validação de roles permitidas
      if (!validRoles.includes(role)) {
        throw new Error(`Role inválida: ${role}`);
      }
  
      const userDocRef = doc(this.firestore, `users/${uid}`);
      await updateDoc(userDocRef, { role });
      console.log(`Role do usuário ${uid} atualizada para: ${role}`);
    } catch (error: any) {
      console.error('Erro ao atualizar role no Firestore:', error.message || error);
      throw error;
    }
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
      const uid = userCredential.user.uid;
  
      // Busca os dados do Firestore
      const userDataFromDb = await this.fetchUserData(uid);
  
      // Atualiza o displayName no Firebase Auth e localStorage
      if (userDataFromDb?.name) {
        await this.updateUserProfile(userDataFromDb.role, userDataFromDb.name);
  
        const userData = {
          uid,
          email: userCredential.user.email,
          displayName: userDataFromDb.name,
          role: userDataFromDb.role || 'user', // Define 'user' como role default
        };

        console.log('AAAAAAAAAAAAAAAAAAAA Role retornada do Firestore:', userDataFromDb.role);

        localStorage.setItem('user', JSON.stringify(userData));
        console.log('Dados atualizados no localStorage:', userData);
      }
  
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
    localStorage.removeItem('user'); // Remova as informações do usuário
    localStorage.removeItem('userRole'); // Caso tenha outro item relacionado ao papel
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
      if (userData?.role) {
        console.log(`Usuário ${userId} possui o papel: ${userData.role}`);
        return userData.role;
      } else {
        console.warn(`Usuário ${userId} não possui um papel definido. Retornando 'user' como padrão.`);
        return 'user';
      }
    } catch (error) {
      console.error(`Erro ao buscar o papel do usuário ${userId}:`, error);
      return 'user'; // Retorna 'user' em caso de erro
    }
  }  

  /**
   * Verifica se o usuário atual é admin.
   * 
   * @returns Verdadeiro se for admin, falso caso contrário.
   */
  public isAdmin(): boolean {
    const userRole = localStorage.getItem('role');
    return userRole === 'admin';
  }

  /**
   * Verifica se o usuário atual é um usuário comum.
   * 
   * @returns Verdadeiro se for user, falso caso contrário.
   */
  public isUser(): boolean {
    const userRole = localStorage.getItem('role');
    return userRole === 'user';
  }

  

  public async updateUserProfile( role: string, name: string): Promise<void> {
    const user = this.auth.currentUser;
    if (user) {
      try {
        await updateProfile(user, { displayName: name });
        console.log(`DisplayName atualizado para: ${name}`);
      } catch (error) {
        console.error('Erro ao atualizar displayName:', error);
      }
    } else {
      console.error('Nenhum usuário autenticado encontrado para atualizar displayName.');
    }

    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (currentUser.role === 'admin') {
        console.warn('Tentativa de sobrescrever role de admin!');
        return; // Bloqueia a sobrescrita
      }
    }

  

  /**
   * Obtém o nome do usuário armazenado no localStorage.
   * 
   * @returns O nome do usuário ou null.
   */
  getUserName(): string | null {
    if (this.isBrowser()) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          return user.displayName || null; // Certifique-se de buscar o displayName corretamente
        } catch (error) {
          console.error('Erro ao parsear os dados do usuário no localStorage:', error);
        }
      }
    }
    return null;
  }

  public async fetchUserData(uid: string): Promise<any> {
    try {
      const userDataFromDb = await this.firestoreService.getDocument<{ name: string; role: string }>(`users/${uid}`);
      if (userDataFromDb) {
        console.log('Dados do Firestore:', userDataFromDb);
        return userDataFromDb; // Retorna os dados do Firestore
      } else {
        console.warn('Nenhum dado encontrado para o UID:', uid);
        return null;
      }
    } catch (error) {
      console.error('Erro ao buscar dados do Firestore:', error);
      throw error;
    }
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
  public async register<T extends { name: string; role?: string }>(
    email: string,
    password: string,
    registerUser: T
  ): Promise<UserCredential> {
    try {
      const userCredential: UserCredential = await createUserWithEmailAndPassword(this.auth, email, password);
  
      const userData = {
        ...registerUser,
        email,
        role: registerUser.role || 'user', // Define a role com base nos dados passados
      };
  
      console.log('Dados enviados para o Firestore:', userData);
  
      await this.firestoreService.createDocument(`users/${userCredential.user.uid}`, userData);
      return userCredential;
    } catch (error: any) {
      let errorMessage = '';
  
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = `Endereço de email: ${email} já está em uso em outra conta.`;
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
          errorMessage = 'Erro desconhecido ao registrar o usuário.';
      }
  
      console.error('Erro ao registrar o usuário:', errorMessage);
      throw new Error(errorMessage);
    }
  }
  async fetchAndUpdateUserRole(uid: string): Promise<void> {
    try {
      const userDocRef = doc(this.firestore, `users/${uid}`);
      const userSnapshot = await getDoc(userDocRef);
  
      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        const updatedUser = {
          uid,
          email: this.auth.currentUser?.email || '',
          displayName: userData['name'] || 'Usuário',
          role: userData['role'] || 'user',
        };
  
        localStorage.setItem('user', JSON.stringify(updatedUser));
        console.log('Dados do usuário atualizados no localStorage:', updatedUser);
      } else {
        console.error('Usuário não encontrado no Firestore.');
      }
    } catch (error) {
      console.error('Erro ao buscar ou atualizar role no Firestore:', error);
    }
  }  
}

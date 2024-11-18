import {Injectable} from '@angular/core';
import {
  Auth, authState, createUserWithEmailAndPassword, sendPasswordResetEmail,
  signInWithEmailAndPassword, User, UserCredential
} from '@angular/fire/auth';

import {User as UserInfo} from "../../models/user";

@Injectable({
  providedIn: 'root'
})
export class FireAuthService {
  private user: User | null = null;

  constructor(
    private auth: Auth
  ) {
    // this.listenToAuthStateChanges();
  }

  /**
   * Escuta as mudanças no estado de autenticação do usuário.
   * Se o usuário estiver logado, exibe as informações do usuário no console.
   * Caso contrário, exibe uma mensagem de "usuário não encontrado".
   */
  public listenToAuthStateChanges(): void {
    authState(this.auth).subscribe((user: User | null) => {
      if (user) {
        console.log(user)
      } else {
        console.log('user not found')
        // User is signed out
      }
    });
  }

  /**
   * Registra um novo usuário com email e senha.
   * Se o registro for bem-sucedido, define o usuário autenticado no sistema.
   *
   * @param email O endereço de email do novo usuário.
   * @param password A senha escolhida para o novo usuário.
   * @returns Retorna a credencial do usuário registrado.
   */
  private async signUpWithEmailAndPassword(email: string, password: string): Promise<UserCredential> {
    const cred = await createUserWithEmailAndPassword(
      this.auth,
      email, password
    );
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
   * @returns Retorna a credencial do usuário autenticado.
   */
  public signInWithEmailAndPassword(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  /**
   * Faz o logout do usuário autenticado.
   * Finaliza a sessão do usuário.
   *
   * @returns Retorna uma promessa que é resolvida quando o logout for concluído.
   */
  public async signOut(): Promise<void> {
    await this.auth.signOut();
  }


  //Método para armazenar o nome do usuário e exibí-lo no TopBar
  public getUserName(): string | null {
    return localStorage.getItem('userName');
  }

  /**
   * Envia um email para redefinição de senha para o endereço de email fornecido.
   *
   * @param email O endereço de email do usuário que deseja redefinir a senha.
   * @returns Retorna uma promessa que é resolvida quando o email de redefinição de senha for enviado.
   */
  public async sendPasswordResetEmail(email: string): Promise<void> {
    return sendPasswordResetEmail(this.auth, email);
  }

// MÉTODOS MAIS ESPECÍFICOS

  /**
 * Registra um novo usuário utilizando o serviço de autenticação e armazena informações adicionais no banco de dados.
 *
 * @param email - O endereço de e-mail do usuário para registro.
 * @param password - A senha associada ao endereço de e-mail para registro.
 * @param registerUser - Um objeto contendo informações adicionais do usuário a serem armazenadas.
 * @throws Lança uma exceção em caso de erro durante o processo de registro.
 */
  async register<T>(email: string, password: string, registerUser: T): Promise<UserCredential> {
    try {
      const userCredential: UserCredential = await createUserWithEmailAndPassword(this.auth, email, password);
  
      // Adiciona o email ao objeto de dados do usuário
      const userData = { ...registerUser, email };
  
      // Chame o ParentService ou outro serviço para salvar `userData` no Firestore
      // Se o ParentService não estiver disponível aqui, passe `userData` no componente ou serviço onde o ParentService está sendo chamado.
      
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
          errorMessage = `Campo da senha vazio`;
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

import {inject, Injectable} from '@angular/core';
import {Router} from '@angular/router';
//
// import {AngularFireAuth} from '@angular/fire/compat/auth';
// import {AngularFirestore} from '@angular/fire/compat/firestore';
// import {map} from 'rxjs/operators';
//
// // models
// import {User} from "../../models/user";
// import {createUserWithEmailAndPassword, getAuth} from "@angular/fire/auth";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: any;
  error: any;

  constructor(
    // private afs: AngularFirestore,
    private _router: Router,
  ) {
  }
  //https://github.com/agatha-soft/angular-18-firebase-boilerplate/blob/main/src/app/services/firestorage.service.ts

  /**
   * Método para autenticação de usuário usando email e senha.
   *
   * @param email - O endereço de email do usuário.
   * @param password - A senha do usuário.
   */
  // async emailSignIn(email: string, password: string) {
  //   try {
  //     // Realiza a autenticação do usuário com email e senha
  //     const credential = await this.auth.signInWithEmailAndPassword(email, password);
  //     this.user = credential.user;
  //
  //     // Verifica se o usuário foi autenticado corretamente
  //     if (this.user) {
  //       const uid = this.user.uid;
  //
  //       // Acessa a coleção 'users' no Firestore e obtém o documento do usuário
  //       const collection = this.afs.collection<any>('users');
  //       const doc = collection.doc(uid);
  //
  //       // Obtém os dados do usuário do Firestore
  //       const userData$ = doc.get().pipe(
  //         map(snapshot => {
  //           if (snapshot.exists) {
  //             const userData = snapshot.data();
  //             // Adiciona a propriedade 'id' com o valor de 'uid' ao objeto userData
  //             userData.id = uid;
  //             return userData;
  //           } else {
  //             // Se o documento do usuário não existir, lança um erro
  //             throw new Error('Usuário não encontrado');
  //           }
  //         })
  //       );
  //
  //       // Subscreve-se ao Observable para obter os dados do usuário
  //       userData$.subscribe(userData => {
  //         // Armazena os dados do usuário no localStorage
  //         localStorage.setItem('userData', JSON.stringify(userData));
  //
  //         // Redireciona o usuário para a página inicial após a autenticação bem-sucedida
  //         this._router.navigate(['/']);
  //       }, error => {
  //         // Trata erros na obtenção dos dados do usuário
  //         console.error('Erro ao obter usuário:', error);
  //       });
  //
  //     } else {
  //       // Trata o caso onde o usuário não é autenticado
  //       throw new Error('Erro na autenticação');
  //     }
  //
  //   } catch (error) {
  //     // Armazena o erro para tratamento posterior
  //     this.error = error;
  //     console.error('Erro na autenticação:', error);
  //   }
  // }
  //
  // /**
  //  * Método para realizar o logout do usuário.
  //  */
  // async signOut() {
  //   try {
  //     // Realiza o logout do usuário
  //     await this.auth.signOut();
  //
  //     // Remove os dados do usuário do localStorage
  //     localStorage.removeItem('userData');
  //
  //     // Reseta a referência do usuário
  //     this.user = null;
  //
  //   } catch (error) {
  //     // Loga qualquer erro que ocorrer durante o processo de logout
  //     console.error('Erro ao deslogar:', error);
  //   }
  // }
  //
  // /**
  //  * Atualiza as informações de um usuário no banco de dados.
  //  *
  //  * @param updateUser - Um objeto contendo as informações atualizadas do usuário.
  //  * @param idUser - O identificador único do usuário cujas informações serão atualizadas.
  //  * @throws Lança uma exceção em caso de erro durante a atualização.
  //  */
  // async updateUser(updateUser: User, idUser: string) {
  //   // Obtém uma referência à coleção 'users' no banco de dados
  //   const collection = this.afs.collection<any>('users');
  //
  //   try {
  //     // Atualiza os dados do usuário com base no identificador fornecido
  //     await collection.doc(idUser).update(updateUser);
  //
  //     // Exibe uma mensagem de sucesso ao usuário
  //   } catch (error) {
  //     // Em caso de erro, exibe uma mensagem de erro ao usuário
  //   }
  // }
  //
  // /**
  //  * Registra um novo usuário utilizando o serviço de autenticação e armazena informações adicionais no banco de dados.
  //  *
  //  * @param email - O endereço de e-mail do usuário para registro.
  //  * @param password - A senha associada ao endereço de e-mail para registro.
  //  * @param registerUser - Um objeto contendo informações adicionais do usuário a serem armazenadas.
  //  * @throws Lança uma exceção em caso de erro durante o processo de registro.
  //  */
  // async register(email: string, password: string, registerUser: User): Promise<void> {
  //   try {
  //     const auth = getAuth();
  //
  //     // Cria uma nova conta de usuário com e-mail e senha
  //     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  //     const user = userCredential.user;
  //
  //     if (user) {
  //       const uid = user.uid;
  //
  //       // Referência à coleção 'users' no Firestore
  //       const collection = this.afs.collection<User>('users');
  //
  //       // Cria o objeto de usuário a ser armazenado
  //       const userObject: User = {
  //         id: uid,
  //         name: registerUser.name,
  //         email: registerUser.email,
  //         whatsapp: registerUser.whatsapp,
  //         address: registerUser.address
  //       };
  //
  //       // Armazena o objeto de usuário no Firestore
  //       await collection.doc(uid).set(userObject);
  //
  //       // Efetua o login automático do usuário após o registro
  //       await this.emailSignIn(email, password);
  //
  //       // Redireciona o usuário para a página inicial
  //       await this._router.navigate(['/']);
  //     }
  //   } catch (error) {
  //     console.error('Erro durante o registro:', error);
  //     throw error; // Opcional, caso queira propagar o erro
  //   }
  // }

  /**
   * Cria um novo usuário utilizando um endereço de e-mail e senha, e realiza o registro de informações adicionais no banco de dados.
   *
   * @param email - O endereço de e-mail do novo usuário.
   * @param password - A senha associada ao endereço de e-mail para o novo usuário.
   * @param user - Um objeto contendo informações adicionais do novo usuário a serem registradas.
   * @returns Uma Promise que é resolvida quando o processo de criação e registro é concluído com sucesso.
   * @throws Lança uma exceção em caso de erro durante o processo de criação ou registro.
   */
  // async createNewUser(email: string, password: string, user: User): Promise<void> {
  //   try {
  //     // Chama o método register para criar o usuário e salvar informações adicionais
  //     await this.register(email, password, user);
  //   } catch (error) {
  //     // Loga o código de erro para análise
  //     console.error('Erro ao criar usuário:', error);
  //
  //     // Verifica o tipo de erro e loga uma mensagem apropriada
  //     if (error) {
  //       switch (error) {
  //         case 'auth/email-already-in-use':
  //           console.error(`Endereço de email: ${email} já está em uso em outra conta.`);
  //           break;
  //         case 'auth/invalid-email':
  //           console.error(`O email: ${email} é inválido.`);
  //           break;
  //         case 'auth/operation-not-allowed':
  //           console.error(`O email: ${email} não é permitido.`);
  //           break;
  //         case 'auth/missing-password':
  //           console.error(`Campo da senha vazio.`);
  //           break;
  //         case 'auth/weak-password':
  //           console.error(`A senha não é forte o suficiente.`);
  //           break;
  //         default:
  //           console.error('Erro desconhecido:', error);
  //           break;
  //       }
  //     } else {
  //       console.error('Erro desconhecido:', error);
  //     }
  //
  //     // Opcional: lançar o erro para tratamento em outro lugar, se necessário
  //     throw error;
  //   }
  // }



}

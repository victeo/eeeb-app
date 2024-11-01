import { Injectable } from '@angular/core';
import { FireAuthService } from 'app/services/fire-auth/fire-auth.service';
import { FirestoreService } from 'app/services/fire-store/firestore.service';
import { FireStorageService } from 'app/services/fire-storage/fire-storage.service';
import { User as UserInfo } from 'app/models/user';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(
    private fireAuthService: FireAuthService,
    private firestoreService: FirestoreService,
    private fireStorageService: FireStorageService
  ) {}

  /**
   * Registra o usuário, salva informações adicionais no Firestore, e faz upload de um arquivo.
   *
   * @param email - O email do usuário.
   * @param password - A senha do usuário.
   * @param userInfo - Informações adicionais do usuário.
   * @param file - Arquivo a ser enviado para o Firebase Storage.
   * @returns Retorna o ID do usuário registrado.
   */
  async registerUser(email: string, password: string, userInfo: UserInfo, file?: File): Promise<string> {
    // Cria o usuário com Firebase Authentication
    const userCredential = await this.fireAuthService.signUpWithEmailAndPassword(email, password);
    const userId = userCredential.user.uid;

    // Salva dados adicionais do usuário no Firestore
    await this.firestoreService.createDocument(`users/${userId}`, { ...userInfo, uid: userId });

    // Se um arquivo foi fornecido, realiza o upload para o Firebase Storage
    if (file) {
      const filePath = `users/${userId}/profilePicture`; // Exemplo de caminho para armazenar a imagem de perfil
      await this.fireStorageService.uploadFile(file, filePath);
    }

    return userId;
  }
}

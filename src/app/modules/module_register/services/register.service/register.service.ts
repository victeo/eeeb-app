import { Injectable } from '@angular/core';
import { FireAuthService } from 'app/services/fire-auth/fire-auth.service';
import { FirestoreService } from 'app/services/fire-store/firestore.service';
import { FireStorageService } from 'app/services/fire-storage/fire-storage.service';
import { User as UserInfo } from 'app/models/user';
import { UserCredential } from '@angular/fire/auth';

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
   * Registra um novo aluno na coleção "user" e salva as informações adicionais no Firestore.
   *
   * @param email - O email do aluno.
   * @param password - A senha do aluno.
   * @param userInfo - Informações adicionais do aluno.
   * @returns Retorna o ID do aluno registrado.
   */
  async registerUser(email: string, password: string, userInfo: UserInfo): Promise<UserInfo> {
    const userCredential: UserCredential = await this.fireAuthService.register(email, password, userInfo);
    const userId = userCredential.user.uid;

    await this.firestoreService.createDocument(`user/${userId}`, { ...userInfo, uid: userId });
    return userInfo;
  }

  /**
   * Registra um novo responsável na coleção "parents" e salva as informações adicionais no Firestore.
   *
   * @param email - O email do responsável.
   * @param password - A senha do responsável.
   * @param userInfo - Informações adicionais do responsável.
   * @returns Retorna as informações do responsável registrado.
   */
  async registerResponsavel(email: string, password: string, userInfo: UserInfo): Promise<UserInfo> {
    const userCredential: UserCredential = await this.fireAuthService.register(email, password, userInfo);
    const responsavelId = userCredential.user.uid;

    await this.firestoreService.createDocument(`parents/${responsavelId}`, { ...userInfo, uid: responsavelId });
    return userInfo;
  }
}

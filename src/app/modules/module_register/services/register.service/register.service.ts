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

  // Método para registrar um aluno sem autenticação de email e senha
  async registerStudent(studentInfo: any): Promise<string> {
    // Usa o método addDocument para adicionar o aluno e retorna o ID gerado automaticamente
    const studentId = await this.firestoreService.addDocument('students', studentInfo);
    return studentId;
  }
  /**
   * Registra um novo aluno na coleção "students" e salva as informações adicionais no Firestore.
   *
   * @param email - O email do aluno.
   * @param password - A senha do aluno.
   * @param userInfo - Informações adicionais do aluno.
   * @returns Retorna o ID do aluno registrado.
   */
  async registerUser(email: string, password: string, userInfo: UserInfo): Promise<UserInfo> {
    const userCredential: UserCredential = await this.fireAuthService.register(email, password, userInfo);
    const studentId = userCredential.user.uid;

    await this.firestoreService.createDocument(`students/${studentId}`, { ...userInfo, uid: studentId });
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
  
  //const userInfo: User = {
  //  name: 'Maria Souza',
  //  email: 'maria@example.com',
  //  role: 'admin', // Se não for fornecido, será "user" por padrão
  //};
  
  //await this.fireAuthService.register(email, password, userInfo);
  

}

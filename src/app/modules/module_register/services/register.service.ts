import { Injectable } from '@angular/core';
import { FirestoreService } from 'app/services/fire-store/firestore.service';
import { FireStorageService } from 'app/services/fire-storage/fire-storage.service';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(
    private firestoreService: FirestoreService,
    private fireStorageService: FireStorageService
  ) {}

  // Exemplo de uso de um método do FirestoreService para criar um documento
  async createUserDocument(collectionPath: string, data: any): Promise<string> {
    return await this.firestoreService.addDocument(collectionPath, data);
  }

  // Exemplo de uso de um método do FireStorageService para fazer upload de um arquivo
  async uploadUserFile(file: File, path: string) {
    return await this.fireStorageService.uploadFile(file, path);
  }
}

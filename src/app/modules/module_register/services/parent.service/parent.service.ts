import { Injectable } from '@angular/core';
import { FirestoreService } from 'app/services/fire-store/firestore.service';
import { FireStorageService } from 'app/services/fire-storage/fire-storage.service';
import { Parent } from 'app/models/parent';

@Injectable({
  providedIn: 'root'
})
export class ParentService {
  private collectionPath = 'parents'; // Caminho da coleção no Firestore para armazenar os dados de Parent

  constructor(
    private firestoreService: FirestoreService,
    private fireStorageService: FireStorageService
  ) {}

  /**
   * Registra um responsável (Parent) no Firestore e realiza o upload de um arquivo de perfil, se fornecido.
   *
   * @param parentData - Os dados do responsável a serem salvos.
   * @param file - Arquivo opcional a ser enviado para o Firebase Storage.
   * @returns Retorna o ID do documento criado.
   */
  async registerParent(parentData: Parent, file?: File): Promise<string> {
    // Adiciona um novo documento na coleção "parents" e obtém o ID gerado
    const parentId = await this.firestoreService.addDocument(this.collectionPath, parentData);

    // Se um arquivo foi fornecido, realiza o upload para o Firebase Storage
    if (file) {
      const filePath = `${this.collectionPath}/${parentId}/profilePicture`; // Caminho para armazenar a imagem de perfil
      await this.fireStorageService.uploadFile(file, filePath);
    }

    return parentId;
  }

  /**
   * Atualiza os dados de um responsável existente no Firestore.
   *
   * @param parentId - ID do responsável a ser atualizado.
   * @param updatedData - Dados atualizados para o responsável.
   */
  async updateParent(parentId: string, updatedData: Partial<Parent>): Promise<void> {
    const docPath = `${this.collectionPath}/${parentId}`;
    await this.firestoreService.updateDocument(docPath, updatedData);
  }

  /**
   * Exclui um responsável do Firestore.
   *
   * @param parentId - ID do responsável a ser excluído.
   */
  async deleteParent(parentId: string): Promise<void> {
    const docPath = `${this.collectionPath}/${parentId}`;
    await this.firestoreService.deleteDocument(docPath);
  }

  /**
   * Obtém os dados de um responsável específico do Firestore.
   *
   * @param parentId - ID do responsável a ser obtido.
   * @returns Dados do responsável ou null se não encontrado.
   */
  async getParent(parentId: string): Promise<Parent | null> {
    const docPath = `${this.collectionPath}/${parentId}`;
    return await this.firestoreService.getDocument<Parent>(docPath);
  }
}

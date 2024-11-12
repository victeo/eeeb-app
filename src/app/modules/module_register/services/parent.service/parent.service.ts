import { Injectable } from '@angular/core';
import { FirestoreService } from 'app/services/fire-store/firestore.service';
import { Parent } from 'app/models/parent';

@Injectable({
  providedIn: 'root'
})
export class ParentService {
  private collectionPath = 'parents'; // Caminho da coleção no Firestore para armazenar os dados de Parent

  constructor(private firestoreService: FirestoreService) {}

  /**
   * Salva os dados de um responsável (Parent) no Firestore, excluindo a senha.
   *
   * @param userId - O ID do usuário gerado pelo Firebase Authentication.
   * @param parentData - Os dados do responsável a serem salvos.
   */
  async saveParentData(userId: string, parentData: Parent): Promise<void> {
    const docPath = `${this.collectionPath}/${userId}`;
    await this.firestoreService.createDocument(docPath, parentData);
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

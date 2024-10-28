import { Injectable } from '@angular/core';
import { FirestoreService } from '../../../services/fire-store/firestore.service';
import { Links } from '../models/links.model';

@Injectable({
  providedIn: 'root'
})
export class LinksService {
  private collectionPath = 'links';

  constructor(private firestoreService: FirestoreService) {}

  // Método para adicionar um novo link
  async adicionarLink(linktreeData: Links): Promise<string> {
    // Adiciona um novo documento à coleção 'links' usando o FirestoreService
    try {
      const docId = await this.firestoreService.addDocument(this.collectionPath, linktreeData);
      return docId;
    } catch (error) {
      console.error('Erro ao adicionar link:', error);
      throw error; // Propaga o erro para o componente tratar
    }
  }

  // Método para listar links
  listarLinks() {
    // Implemente este método conforme necessário, utilizando o FirestoreService
  }

  // Método para atualizar um link existente
  async atualizarLink(id: string, links: Links): Promise<void> {
    try {
      const docPath = `${this.collectionPath}/${id}`;
      await this.firestoreService.updateDocument(docPath, links);
    } catch (error) {
      console.error('Erro ao atualizar link:', error);
      throw error;
    }
  }

  // Método para remover um link existente
  async removerLink(id: string): Promise<void> {
    try {
      const docPath = `${this.collectionPath}/${id}`;
      await this.firestoreService.deleteDocument(docPath);
    } catch (error) {
      console.error('Erro ao remover link:', error);
      throw error;
    }
  }
}

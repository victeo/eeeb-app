import {Injectable} from '@angular/core';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDocFromServer,
  setDoc,
  updateDoc
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(
    private firestore: Firestore,
  ) {
  }

  /**
   * Cria um novo documento com os dados fornecidos no caminho especificado.
   * Se o documento já existir, ele será substituído pelos novos dados.
   *
   * @param docPath O caminho completo do documento (por exemplo, 'collection/documentID').
   * @param data Os dados que serão salvos no documento.
   * @returns Retorna uma Promise que será resolvida quando o documento for criado.
   */   async createDocument(docPath: string, data: any): Promise<void> {
    const docReference = doc(this.firestore, docPath);
    await setDoc(docReference, data);
  }

  /**
   * Adiciona um novo documento à coleção especificada e gera um ID automaticamente.
   *
   * @param collectionPath O caminho da coleção onde o documento será adicionado (por exemplo, 'collection').
   * @param data Os dados que serão salvos no novo documento.
   * @returns Retorna o ID do documento gerado automaticamente.
   */
  async addDocument(collectionPath: string, data: any) {
    const collectionRef = collection(this.firestore, collectionPath);
    const doc = await addDoc(collectionRef, data);
    return doc.id;
  }

  /**
   * Busca e retorna um documento específico do Firestore pelo caminho fornecido.
   *
   * @param docPath O caminho completo do documento (por exemplo, 'collection/documentID').
   * @returns Retorna os dados do documento como um objeto do tipo T, ou null se o documento não existir.
   */
  async getDocument<T>(docPath: string): Promise<T | null> {
    const docReference = doc(this.firestore, docPath);
    const docSnap = await getDocFromServer(docReference);
    if (docSnap.exists()) {
      return docSnap.data() as T;
    }
    return null;
  }

  /**
   * Atualiza um documento existente com os dados fornecidos no caminho especificado.
   *
   * @param collectionPath O caminho do documento a ser atualizado (por exemplo, 'collection/documentID').
   * @param data Os novos dados para atualizar no documento.
   * @returns Retorna uma Promise que será resolvida quando o documento for atualizado.
   */
  async updateDocument(collectionPath: string, data: any): Promise<void> {
    const docRef = doc(this.firestore, collectionPath);
    await updateDoc(docRef, data);
  }

  /**
   * Exclui um documento específico do Firestore pelo caminho fornecido.
   *
   * @param docPath O caminho completo do documento a ser excluído (por exemplo, 'collection/documentID').
   * @returns Retorna uma Promise que será resolvida quando o documento for excluído.
   */
  async deleteDocument(docPath: string): Promise<void> {
    const docRef = doc(this.firestore, docPath);
    await deleteDoc(docRef); // Exclui o documento no caminho especificado.
  }

  // #endregion

  // Requests to collections


}

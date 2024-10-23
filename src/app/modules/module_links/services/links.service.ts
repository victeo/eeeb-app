import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Links } from '../models/links.model';

@Injectable({
  providedIn: 'root'
})
export class LinksService {
  private collectionPath = 'links';

  constructor(private firestore: AngularFirestore) {}

  // Método para listar links
  listarLinks() {
    return this.firestore.collection<Links>(this.collectionPath).valueChanges({ idField: 'id' });
  }

  // Método para adicionar um novo link
  adicionarLink(linktreeData: Links): Promise<void> {
    const id = this.firestore.createId();
    return this.firestore.collection(this.collectionPath).doc(id).set(linktreeData);
  }

  // Método para atualizar um link existente
  atualizarLink(id: string, links: Links): Promise<void> {
    return this.firestore.collection(this.collectionPath).doc(id).update(links);
  }

  // Método para remover um link existente
  removerLink(id: string): Promise<void> {
    return this.firestore.collection(this.collectionPath).doc(id).delete();
  }
}

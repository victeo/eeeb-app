import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Links } from '../models/links.model';

@Injectable({
  providedIn: 'root'
})
export class LinksService {
  private collectionPath = 'links';

  constructor(private firestore: AngularFirestore) {}

  // Método para listar os links
  listarLinks(): Observable<Links[]> {
    return this.firestore.collection<Links>(this.collectionPath).valueChanges({ idField: 'id' });
  }

  // Método para adicionar um novo link
  adicionarLink(links: Links): Promise<void> {
    const id = this.firestore.createId(); // Gera um ID único
    return this.firestore.collection(this.collectionPath).doc(id).set({ ...links, id });
  }

  // Método para atualizar um link
  atualizarLink(id: string, links: Links): Promise<void> {
    return this.firestore.collection(this.collectionPath).doc(id).update(links);
  }

  // Método para remover um link
  removerLink(id: string): Promise<void> {
    return this.firestore.collection(this.collectionPath).doc(id).delete();
  }
  
}
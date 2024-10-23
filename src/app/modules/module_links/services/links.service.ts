import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {Links} from '../models/links.model';

@Injectable({
  providedIn: 'root'
})
export class LinksService {
  private collectionPath = 'links';

  constructor() {
  }

  // Método para listar links
  listarLinks() {
  }

  // Método para adicionar um novo link
  adicionarLink(linktreeData: Links) {

  }

  // Método para atualizar um link existente
  atualizarLink(id: string, links: Links) {
  }

  // Método para remover um link existente
  removerLink(id: string) {
  }
}

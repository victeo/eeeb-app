import {Injectable} from '@angular/core';
import {
  doc,
  Firestore, getDoc,
  setDoc,
} from '@angular/fire/firestore';
import {ShortLinkModel} from "./models/short-link.model";

@Injectable({
  providedIn: 'root'
})
export class ShortLinkService {
  constructor(
    private firestore: Firestore,
  ) {
  }

  async createShortLink(data: ShortLinkModel, slug: string): Promise<void> {
    const slugExists = await this.checkSlugExists(slug);
    if (slugExists) {
      throw new Error('Slug já está em uso. Por favor, escolha outro.');
    }
    const docReference = doc(this.firestore, `shortLinks/${slug}`);
    await setDoc(docReference, data);
  }

  async getShortLink<T>(slug: string): Promise<T | null | ShortLinkModel> {
    const docReference = doc(this.firestore, "shortLinks", slug);  // Correção: especificando o documento "slug"

    const docSnapshot = await getDoc(docReference);  // Correção: getDoc é usado para buscar um único documento

    if (docSnapshot.exists()) {
      return docSnapshot.data() as T;  // Retorna os dados do documento
    } else {
      return null;  // Caso o documento não exista, retorna null
    }
  }

  async checkSlugExists(slug: string): Promise<boolean> {
    const docReference = doc(this.firestore, `shortLinks/${slug}`);
    const docSnapshot = await getDoc(docReference);

    return docSnapshot.exists();  // Retorna true se o documento existir, caso contrário false
  }
}

import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { getAuth } from 'firebase/auth';  // Importando para pegar a autenticação do Firebase
import { ShortLinkModel } from './models/short-link.model';

@Injectable({
  providedIn: 'root'
})
export class ShortLinkService {
  constructor(private firestore: Firestore) {}

  async createShortLink(data: ShortLinkModel, slug: string): Promise<void> {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    const slugExists = await this.checkSlugExists(slug);
    if (slugExists) {
      throw new Error('Slug já está em uso. Por favor, escolha outro.');
    }

    const docReference = doc(this.firestore, `shortLinks/${slug}`);
    await setDoc(docReference, { ...data, userId: user.uid });  // Passando o UID do usuário
  }

  async getShortLink<T>(slug: string): Promise<T | null | ShortLinkModel> {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    const docReference = doc(this.firestore, `shortLinks/${slug}`);
    const docSnapshot = await getDoc(docReference);

    if (docSnapshot.exists()) {
      return docSnapshot.data() as T;
    } else {
      return null;  // Caso o link não exista
    }
  }

  // Verificar se o slug existe
  async checkSlugExists(slug: string): Promise<boolean> {
    const docReference = doc(this.firestore, `shortLinks/${slug}`);
    const docSnapshot = await getDoc(docReference);
    return docSnapshot.exists();
  }
}
import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  setDoc,
  updateDoc,
  getDocs,
  deleteDoc,
} from '@angular/fire/firestore';
import { ErrorFn } from '@angular/fire/auth';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { from, Observable } from 'rxjs';
import { where } from 'firebase/firestore';
import { query } from 'firebase/firestore';
import { fetchSignInMethodsForEmail } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class SistemaService {
  constructor(private firestore: Firestore, private auth: Auth) {}

  // Obter todos os usuários
  getUsers(): Observable<any[]> {
    const usersCollection = collection(this.firestore, 'users');
    return from(
      getDocs(usersCollection).then((snapshot) =>
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      )
    );
  }

  // Criar um novo usuário com role
  createUser(user: { name: string; email: string; role: string }): Observable<void> {
    const userDoc = doc(this.firestore, `users/${user.email}`);
    return from(setDoc(userDoc, user));
  }

  // Atualizar role de um usuário
  async updateRole(email: string, newRole: string): Promise<void> {
    try {
      // Busca o usuário no Firestore pelo e-mail
      const userQuery = query(collection(this.firestore, 'users'), where('email', '==', email));
      const querySnapshot = await getDocs(userQuery);
  
      if (!querySnapshot.empty) {
        // Atualiza a role no Firestore
        const userDoc = querySnapshot.docs[0].ref;
        await updateDoc(userDoc, { role: newRole });
        console.log('Role atualizada com sucesso.');
      } else {
        console.error('Usuário não encontrado.');
      }
    } catch (error: any) {
      console.error('Erro ao atualizar role:', error.message || error);
    }
  }
  
  async getAllUsers(): Promise<any[]> {
    const collections = ['admins', 'students', 'parents', 'professors', 'coordinators'];
    const allUsers: any[] = [];
  
    for (const collectionName of collections) {
      const collectionRef = collection(this.firestore, collectionName);
      const querySnapshot = await getDocs(collectionRef);
  
      querySnapshot.forEach((doc) => {
        allUsers.push({ id: doc.id, ...doc.data() });
      });
    }
  
    return allUsers;
  }

  updateUserRole(userId: string, newRole: string): Observable<void> {
    const userDocRef = doc(this.firestore, `users/${userId}`); // Caminho do documento do usuário
    return from(updateDoc(userDocRef, { role: newRole })); // Atualiza a role no Firestore
  }
  
  async saveUserToSpecificCollection(
    uid: string,
    data: { name: string; email: string; role: string }
  ): Promise<void> {
    const { role } = data;
  
    let collectionName = '';
    switch (role) {
      case 'admin':
        collectionName = 'admins';
        break;
      case 'professor':
        collectionName = 'professors';
        break;
      case 'coordination':
        collectionName = 'coordinators';
        break;
      case 'student':
        collectionName = 'students';
        break;
      case 'parent':
        collectionName = 'parents';
        break;
      default:
        throw new Error('Role desconhecida. Não é possível salvar o usuário.');
    }
  
    const userDoc = doc(this.firestore, `${collectionName}/${uid}`);
    await setDoc(userDoc, data);
  }  

  // Excluir um usuário
  deleteUser(userId: string): Observable<void> {
    const userDoc = doc(this.firestore, `users/${userId}`);
    return from(deleteDoc(userDoc));
  }

  async createAdminUser(email: string, password: string, name: string): Promise<void> {
    try {
      // Verifica se o e-mail já está em uso
      const signInMethods = await fetchSignInMethodsForEmail(this.auth, email);
      if (signInMethods.length > 0) {
        throw new Error('O e-mail já está em uso. Escolha outro e-mail.');
      }
  
      // Cria o usuário no Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;
  
      // Adiciona o usuário ao Firestore com a role "admin"
      const userDoc = doc(this.firestore, `users/${user.uid}`);
      await setDoc(userDoc, {
        name: name,
        email: email,
        role: 'admin',
        createdAt: new Date(),
      });
  
      console.log('Usuário admin criado com sucesso:', user);
    } catch (error:any) {
      console.error('Erro ao criar usuário admin:', error.message || error);
    }
  }
  catch (error:any) {
    if (error.code === 'auth/email-already-in-use') {
      console.error('Erro: O e-mail já está em uso.');
    } else {
      console.error('Erro ao criar usuário admin:', error.message || error);
    }
  }
  
}

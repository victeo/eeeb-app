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
import { FirestoreService } from 'app/services/fire-store/firestore.service';
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
  constructor(private firestore: Firestore, private auth: Auth, private firestoreService: FirestoreService) {}

  // Obter todos os usuários
  getUsers(): Observable<{ id: string; name: string; email: string; role: string }[]> {
    const usersCollection = collection(this.firestore, 'users');
    return from(
      getDocs(usersCollection).then((snapshot) =>
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as { id: string; name: string; email: string; role: string }))
      )
    );
  }  

  async getUsersByRole(role: string): Promise<any[]> {
    const validRoles = ['admins', 'students', 'parents', 'professors', 'coordinators'];
    if (!validRoles.includes(role)) {
      throw new Error(`Role desconhecida: ${role}`);
    }
  
    const collectionRef = collection(this.firestore, role);
    const querySnapshot = await getDocs(collectionRef);
  
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  // Criar um novo usuário com role
  createUser(user: { uid: string; name: string; email: string; role: string }): Observable<void> {
    const userDoc = doc(this.firestore, `users/${user.uid}`);
    return from(setDoc(userDoc, user));
  }
  

  // Atualizar role de um usuário
  async updateRole(email: string, newRole: string): Promise<void> {
    try {
      const validRoles = ['admin', 'professor', 'coordination', 'student', 'parent'];
      if (!validRoles.includes(newRole)) {
        throw new Error(`Role inválida: ${newRole}`);
      }
  
      const userQuery = query(collection(this.firestore, 'users'), where('email', '==', email));
      const querySnapshot = await getDocs(userQuery);
  
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0].ref;
        await updateDoc(userDoc, { role: newRole });
        console.log(`Role do usuário ${email} atualizada para: ${newRole}`);
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
    const validRoles = ['admin', 'professor', 'coordination', 'student', 'parent'];
    const { role } = data;
  
    if (!validRoles.includes(role)) {
      throw new Error(`Role desconhecida: ${role}. Não é possível salvar o usuário.`);
    }
  
    const collectionName = `${role}s`; // Exemplo: admin -> admins
    const userDoc = doc(this.firestore, `${collectionName}/${uid}`);
    await setDoc(userDoc, data);
  
    console.log(`Usuário ${data.name} salvo na coleção ${collectionName}`);
  }
  

  // Excluir um usuário
  deleteUser(userId: string): Observable<void> {
    const userDoc = doc(this.firestore, `users/${userId}`);
    return from(deleteDoc(userDoc));
  }

  async createAdminUser(email: string, password: string, name: string): Promise<void> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const uid = userCredential.user.uid;
  
      await this.firestoreService.createDocument(`users/${uid}`, {
        name,
        email,
        role: 'admin',
        createdAt: new Date(),
      });
  
      console.log('Usuário admin criado com sucesso!');
    } catch (error) {
      console.error('Erro ao criar usuário admin:', error);
      throw error;
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

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private auth: Auth, private firestore: Firestore, private router: Router) {}

  canActivate(): Observable<boolean> {
    const user = this.auth.currentUser;
    if (user) {
      const userDocRef = doc(this.firestore, `users/${user.uid}`);
      return from(
        getDoc(userDocRef).then((snapshot) => {
          if (snapshot.exists()) {
            const userData = snapshot.data();
            if (userData && userData['role'] === 'admin') {
              console.log('Acesso permitido: role = admin');
              return true;
            }
          }
          console.warn('Acesso negado. Redirecionando...');
          this.router.navigate(['/']);
          return false;
        })
      );
    } else {
      console.warn('Usuário não autenticado. Redirecionando para login...');
      this.router.navigate(['/login']);
      return from(Promise.resolve(false));
    }
  }
}

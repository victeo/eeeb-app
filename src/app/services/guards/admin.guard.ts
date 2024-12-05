import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Observable, from, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private auth: Auth, private firestore: Firestore, private router: Router) {}

  canActivate(): Observable<boolean> {
    const user = this.auth.currentUser;

    if (user) {
      console.log(`AdminGuard - Usuário autenticado: UID = ${user.uid}`);
      
      const userDocRef = doc(this.firestore, `users/${user.uid}`);
      return from(getDoc(userDocRef)).pipe(
        map((snapshot) => {
          if (snapshot.exists()) {
            const userData = snapshot.data();
            console.log('AdminGuard - Dados do usuário recuperados:', userData);

            if (userData && userData['role'] === 'admin') {
              console.log('AdminGuard - Acesso permitido: role = admin');
              return true;
            }
          }

          console.warn('AdminGuard - Acesso negado: role não é admin ou usuário não encontrado.');
          this.router.navigate(['/']);
          return false;
        }),
        catchError((error) => {
          console.error('AdminGuard - Erro ao acessar Firestore:', error);
          this.router.navigate(['/']);
          return of(false);
        })
      );
    } else {
      console.warn('AdminGuard - Usuário não autenticado. Redirecionando para login...');
      this.router.navigate(['/login']);
      return of(false);
    }
  }
}

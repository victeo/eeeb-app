import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth, authState, User } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Observable, of, from } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private auth: Auth, private firestore: Firestore, private router: Router) {}

  canActivate(): Observable<boolean> {
    return authState(this.auth).pipe(
      switchMap((user: User | null) => {
        if (user) {
          console.log('AdminGuard - Usuário autenticado:', user);

          const userDocRef = doc(this.firestore, `users/${user.uid}`);
          return from(getDoc(userDocRef)).pipe(
            map((snapshot) => {
              console.log('AdminGuard - Documento Firestore encontrado:', snapshot.exists());

              if (snapshot.exists()) {
                const userData = snapshot.data() as { role: string };
                console.log('AdminGuard - Dados do usuário:', userData);

                // Verificação de role
                if (userData.role === 'admin') {
                  console.log('AdminGuard - Acesso permitido (role = admin)');
                  return true;
                } else {
                  console.warn(`AdminGuard - Acesso negado. Role atual: ${userData.role}`);
                }
              } else {
                console.warn('AdminGuard - Documento do usuário não encontrado no Firestore.');
              }

              this.router.navigate(['/']);
              return false;
            }),
            catchError((error) => {
              console.error('AdminGuard - Erro ao acessar Firestore:', error);
              this.router.navigate(['/']);
              return of(false); // Retorna um Observable que emite false
            })
          );
        } else {
          console.warn('AdminGuard - Usuário não autenticado.');
          this.router.navigate(['/login']);
          return of(false); // Retorna um Observable que emite false
        }
      }),
      catchError((error) => {
        console.error('AdminGuard - Erro inesperado:', error);
        this.router.navigate(['/']);
        return of(false); // Retorna um Observable que emite false
      })
    );
  }
}

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { doc, getDoc } from 'firebase/firestore';
import { Observable, from, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProfessorGuard implements CanActivate {
  constructor(private auth: Auth, private firestore: Firestore, private router: Router) {}

  canActivate(): Observable<boolean> {
    const user = this.auth.currentUser;

    if (user) {
      const userDocRef = doc(this.firestore, `users/${user.uid}`);
      return from(getDoc(userDocRef)).pipe(
        map((snapshot) => {
          if (snapshot.exists()) {
            const userData = snapshot.data();
            if (userData && userData['role'] === 'professor') {
              return true;
            }
          }
          this.router.navigate(['/']);
          return false;
        }),
        catchError(() => {
          this.router.navigate(['/']);
          return of(false);
        })
      );
    } else {
      this.router.navigate(['/']);
      return of(false);
    }
  }
}

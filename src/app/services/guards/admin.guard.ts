import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { User } from 'app/models/user';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private auth: Auth, private firestore: Firestore, private router: Router) {}

  canActivate(): Observable<boolean> {
    const user = this.auth.currentUser;
    if (user) {
      const userDoc = doc(this.firestore, `users/${user.uid}`);
      return from(
        getDoc(userDoc).then((snapshot) => {
          const userData = snapshot.data() as User; // Tipando o retorno para UserData
          if (userData && userData['role'] === 'admin') {
            return true;
          } else {
            this.router.navigate(['/']);
            return false;
          }
        })
      );
    } else {
      this.router.navigate(['/']);
      return from(Promise.resolve(false));
    }
  }
}
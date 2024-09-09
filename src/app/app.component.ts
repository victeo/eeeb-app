import { Component, inject  } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import {environment} from "../environments/environment";

// Services
import {AuthService} from "./services/auth/auth.service";
import { Firestore } from '@angular/fire/firestore';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less',
  providers: [
    { provide: FIREBASE_OPTIONS, useValue: environment.firebase }
  ],
})
export class AppComponent {
  title = 'eeeb-app';
  firestore: Firestore = inject(Firestore);

  constructor( private authService: AuthService,
  ) {
  }
}

import {routes} from './app.routes';
import {ApplicationConfig, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import {provideClientHydration} from '@angular/platform-browser';
import {provideAnimations} from '@angular/platform-browser/animations';

import {provideFirebaseApp, initializeApp} from '@angular/fire/app';
import {provideAuth, getAuth} from '@angular/fire/auth';
import {provideFirestore, getFirestore} from '@angular/fire/firestore';

import {environment} from '../environments/environment';
import {getFunctions, provideFunctions} from "@angular/fire/functions";
import {getStorage, provideStorage} from "@angular/fire/storage";

import {UserGuard} from "./services/guards/user.guard";
import {AdminGuard} from "./services/guards/admin.guard";
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [UserGuard, AdminGuard,
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(
      environment.firebase
    )),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideFunctions(() => getFunctions()),
    provideStorage(() => getStorage()),
    provideAnimations(),
    provideHttpClient(withFetch())

  ],
};

// provideAnimations(),

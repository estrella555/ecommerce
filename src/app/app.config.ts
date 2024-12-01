import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

///////// Firebase
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';

///////// HttpClientModule para peticiones HTTP
import { HttpClientModule } from '@angular/common/http';

/////// Angular Forms
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

///// Firebase Authentication
import { provideAuth, getAuth } from '@angular/fire/auth';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      HttpClientModule, // Para peticiones HTTP
      ReactiveFormsModule, // Formularios reactivos
      FormsModule, // Formularios template-driven
      AngularFireAuthModule // Autenticación Firebase
    ),
    provideFirebaseApp(() =>
      initializeApp({
        apiKey: 'AIzaSyB_zdV6Vf5-MBO13YdMMTgkZI9xe3Omqys',
        authDomain: 'proyecto3-b0910.firebaseapp.com',
        projectId: 'proyecto3-b0910',
        storageBucket: 'proyecto3-b0910.appspot.com', // Corregí el nombre del bucket
        messagingSenderId: '49006438504',
        appId: '1:49006438504:web:955909744bfaadc6edb3dd',
        measurementId: 'G-6G6NYP1NVK',
      })
    ),
    provideAuth(() => getAuth()), // Proveedor de autenticación
    provideFirestore(() => getFirestore()), // Proveedor de Firestore
    provideStorage(() => getStorage()), // Proveedor de Firebase Storage
    provideZoneChangeDetection({ eventCoalescing: true }), // Optimización de cambios
    provideRouter(routes), // Rutas de la aplicación
  ],
};


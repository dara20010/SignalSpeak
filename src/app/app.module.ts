import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {RouterModule} from "@angular/router";
import {CoreModule} from "./core/core.module";
import {ReactiveFormsModule} from "@angular/forms";
import { AuthService } from './core/services/auth.service';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB6K7n6rU7mQuO7Njf-DBO6_Sr4-tldWNc",
  authDomain: "signalspeak-bbb8c.firebaseapp.com",
  projectId: "signalspeak-bbb8c",
  storageBucket: "signalspeak-bbb8c.appspot.com",
  messagingSenderId: "114245536923",
  appId: "1:114245536923:web:281c063a754d2dc0cf4a3e",
  measurementId: "G-F4KV5DBGQH"
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    RouterModule,
    CoreModule,
    ReactiveFormsModule,
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth())
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }

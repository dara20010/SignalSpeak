import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {FirebaseApp} from "@angular/fire/app";
import {AngularFireAuth} from "@angular/fire/compat/auth";

@Component({
  selector: 'app-global-layout',
  templateUrl: './global-layout.component.html',
  styleUrls: ['./global-layout.component.css']
})
export class GlobalLayoutComponent {
  isLoggedIn = false;
  constructor(private authService: AuthService, private afAuth: AngularFireAuth){
    this.isLoggedIn = authService.isLoggedIn;
    this.afAuth.authState.subscribe((user) => {
      this.isLoggedIn = !!user;
    })
  }
  logOut(){
    this.authService.Logout();
  }
}

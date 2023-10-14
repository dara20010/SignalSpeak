import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-global-layout',
  templateUrl: './global-layout.component.html',
  styleUrls: ['./global-layout.component.css']
})
export class GlobalLayoutComponent {
  isLoggedIn = false;
  constructor(private authService: AuthService){
    this.isLoggedIn = authService.isLoggedIn;
  }
  logOut(){
    this.authService.Logout();
  }
}

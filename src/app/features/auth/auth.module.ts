import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { SignInFormComponent } from './components/sign-in-form/sign-in-form.component';
import { SignUpFormComponent } from './components/sign-up-form/sign-up-form.component';
import {UiModule} from "../../ui/ui.module";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    SignInComponent,
    SignUpComponent,
    SignInFormComponent,
    SignUpFormComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    UiModule,
    ReactiveFormsModule
  ]
})
export class AuthModule { }

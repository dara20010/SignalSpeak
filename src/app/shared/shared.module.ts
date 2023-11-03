import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlphabetComponent } from './components/alphabet/alphabet.component';
import {UiModule} from "../ui/ui.module";



@NgModule({
  declarations: [
    AlphabetComponent
  ],
  imports: [
    CommonModule,
    UiModule
  ]
})
export class SharedModule { }

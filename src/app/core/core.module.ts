import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GlobalLayoutComponent} from './layouts/global-layout/global-layout.component';
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {UiModule} from "../ui/ui.module";


@NgModule({
  declarations: [
    GlobalLayoutComponent
  ],
  exports: [
    GlobalLayoutComponent
  ],
  imports: [
    CommonModule,
    RouterOutlet,
    UiModule,
    RouterLink,
    RouterLinkActive
  ]
})
export class CoreModule {
}

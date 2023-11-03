import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GlobalLayoutComponent} from "./core/layouts/global-layout/global-layout.component";
import {authGuard} from "./core/guards/auth.guard";

const routes: Routes = [
  {
    path: '',
    component: GlobalLayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'tools',
        canMatch: [authGuard]
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'auth',
        canMatch: []
      },
      {
        path: 'auth',
        loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
      },
      {
        path: 'tools',
        loadChildren: () => import('./features/tools/tools.module').then(m => m.ToolsModule),
        canMatch: [authGuard],
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

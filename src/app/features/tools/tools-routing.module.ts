import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LspToTextComponent} from "./pages/lsp-to-text/lsp-to-text.component";
import {TextToLspComponent} from "./pages/text-to-lsp/text-to-lsp.component";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'lsp-to-text'
  },
  {
    path: 'lsp-to-text',
    component: LspToTextComponent
  },
  {
    path: 'text-to-lsp',
    component: TextToLspComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ToolsRoutingModule { }

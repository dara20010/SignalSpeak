import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ToolsRoutingModule} from './tools-routing.module';
import {LspToTextComponent} from './pages/lsp-to-text/lsp-to-text.component';
import {MatCardModule} from "@angular/material/card";
import {MatChipsModule} from "@angular/material/chips";
import {MatDividerModule} from "@angular/material/divider";
import {TextToLspComponent} from './pages/text-to-lsp/text-to-lsp.component';
import {UiModule} from "../../ui/ui.module";
import {SharedModule} from "../../shared/shared.module";
import {FormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    LspToTextComponent,
    TextToLspComponent
  ],
    imports: [
        CommonModule,
        ToolsRoutingModule,
        MatCardModule,
        MatChipsModule,
        MatDividerModule,
        UiModule,
        SharedModule,
        FormsModule
    ]
})
export class ToolsModule {
}

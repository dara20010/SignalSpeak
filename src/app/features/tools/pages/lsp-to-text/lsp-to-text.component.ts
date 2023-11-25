import {Component} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {AlphabetComponent} from "../../../../shared/components/alphabet/alphabet.component";


@Component({
  selector: 'app-lsp-to-text',
  templateUrl: './lsp-to-text.component.html',
  styleUrls: ['./lsp-to-text.component.css']
})
export class LspToTextComponent {
  output: string = '';

  constructor(
    public dialog: MatDialog
  ) {

  }

  openAlphabetDialog() {
    const dialogRef = this.dialog.open(AlphabetComponent);
  }

  clear() {
    this.output = '';
  }

  charDetectedHandler(event: any) {
    console.log(event);
    this.output += event;
  }
}

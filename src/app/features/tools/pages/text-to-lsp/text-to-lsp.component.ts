import { Component } from '@angular/core';
import {AlphabetComponent} from "../../../../shared/components/alphabet/alphabet.component";
import {MatDialog} from "@angular/material/dialog";
import {Letter, Word} from "../../../../core/models/word.model";

@Component({
  selector: 'app-text-to-lsp',
  templateUrl: './text-to-lsp.component.html',
  styleUrls: ['./text-to-lsp.component.css']
})
export class TextToLspComponent{
  output?: Letter[][];
  words: Word[] = [];
  textToTranslate: string = 'Buenos dias';
  longtext: string = " La clase \"flex-1\" esté aplicada a ambos mat-card.\n" +
    "El mat-card-content del segundo mat-card no tenga una altura fija (como \"h-full\"), lo que permitirá que se ajuste automáticamente en función del contenido.\n" +
    "La clase \"flex-column\" esté aplicada al segundo mat-card-content, lo que debería permitir que ocupe todo el espacio disponible verticalmente y que se desplace si es necesario.\n" +
    "Esto debería garantizar que ambos mat-card ocupen la misma cantidad de altura y que el segundo mat-card  La clase \"flex-1\" esté aplicada a ambos mat-card.\n" +
    "El mat-card-content del segundo mat-card no tenga una altura fija (como \"h-full\"), lo que permitirá que se ajuste automáticamente en función del contenido.\n" +
    "La clase \"flex-column\" esté aplicada al segundo mat-card-content, lo que debería permitir que ocupe todo el espacio disponible verticalmente y que se desplace si es necesario.\n" +
    "Esto debería garantizar que ambos mat-card ocupen la misma cantidad de altura y que el segundo mat-card  La clase \"flex-1\" esté aplicada a ambos mat-card.\n" +
    "El mat-card-content del segundo mat-card no tenga uEl mat-card-content del segundo mat-card no tenga una altura fija (como \"h-full\"), lo que pEl mat-card-content del segundo mat-card no tenga una altura fija (como \"h-full\"), lo que pEl mat-card-content del segundo mat-card no tenga una altura fija (como \"h-full\"), lo que pEl mat-card-content del segundo mat-card no tenga una altura fija (como \"h-full\"), lo que pna altura fija (como \"h-full\"), lo que permitirá que se ajuste automáticamente en función del contenido.\n" +
    "La clase \"flex-column\" esté aplicada al segundo mat-card-content, lo que debería permitir que ocupe todo el espacio disponible verticalmente y que se desplace si es necesario.\n" +
    "Esto debería garantizar que ambos mat-card ocupen la misma cantidad de altura y que el segundo mat-card  La clase \"flex-1\" esté aplicada a ambos mat-card.\n" +
    "El mat-card-content del segundo mat-card no tenga una altura fija (como \"h-full\"), lo que permitirá que se ajuste automáticamente en función del contenido.\n" +
    "La clase \"flex-column\" esté aplicada al segundo mat-card-content, lo que debería permitir que ocupe todo el espacio disponible verticalmente y que se desplace si es necesario.\n" +
    "Esto debería garantizar que ambos mat-card ocupen la misma cantidad de altura y que el segundo mat-card ";
  constructor(public dialog: MatDialog) {
  }

  openAlphabetDialog() {
    const dialogRef = this.dialog.open(AlphabetComponent);
  }

  clear() {

  }

  translate() {

    if (this.textToTranslate!='') {
      this.output = []
      this.words = []
      let words = this.textToTranslate.trim().split(' ');
      for (let [index, word] of words.entries()) {
        let wordObject = new Word(word, index);
        this.words.push(wordObject);
        this.output?.push(wordObject.getData);
      }
    }
    console.info(this.output)
  }
}

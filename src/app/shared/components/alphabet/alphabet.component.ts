import {Component} from '@angular/core';
import {Letter} from "../../../core/models/word.model";

@Component({
  selector: 'app-alphabet',
  templateUrl: './alphabet.component.html',
  styleUrls: ['./alphabet.component.css']
})
export class AlphabetComponent {
  letters: Letter[];
  constructor() {
    const aslImages: Letter[] = [];
    const alphabet = 'abcdefghiklmnopqrstuvwxy';

    for (let letter of alphabet) {
      const imagePath = `/assets/lsp/${letter}.png`;
      aslImages.push({char: letter.toUpperCase(), sign: imagePath});
    }

    this.letters = aslImages;
  }
}

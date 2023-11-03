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
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';

    for (let letter of alphabet) {
      const imagePath = `/assets/asl/${letter}.png`;
      aslImages.push({char: letter.toUpperCase(), sign: imagePath});
    }

    this.letters = aslImages;
  }
}

export class Word {
  private word: string;
  private wordIndex: number;
  private letterIndex: number;
  private translation: Letter[] = [];
  private signLanguageImages: Record<string, string> = {
    A: 'a.png',
    B: 'b.png',
    C: 'c.png'
  }

  constructor(word: string, index: number) {
    this.word = word.toUpperCase();
    this.wordIndex = index;
    this.letterIndex = 0;
    this.wordToSignLanguageImages();
  }

  get getData() {
    return this.translation
  }

  get getWord() {
    return this.word;
  }

  private wordToSignLanguageImages() {
    for (let char of this.word) {
      const letter = this.word[this.letterIndex];
      const signImage = this.getSignLanguageImage(letter);
      this.translation.push({char: letter, sign: signImage})
      this.letterIndex++;
    }
  }

  private getSignLanguageImage(letter: string) {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    let imagePath = ``;

    if (alphabet.includes(letter.toLowerCase())) {
      return imagePath = `/assets/lsp/${letter.toLowerCase()}.png`;
    }
    return imagePath = `/assets/asl/default.png`;

    /*return this.signLanguageImages[letter] || 'default.png';*/
  }
}

export interface Letter {
  char: string,
  sign: string
}

import {Component} from '@angular/core';
import {AlphabetComponent} from "../../../../shared/components/alphabet/alphabet.component";
import {MatDialog} from "@angular/material/dialog";
import {Letter, Word} from "../../../../core/models/word.model";
import {AngularFirestore, AngularFirestoreDocument} from "@angular/fire/compat/firestore";
import {AuthService, User} from "../../../../core/services/auth.service";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {TextToLspHistoryComponent} from "../../components/text-to-lsp-history/text-to-lsp-history.component";

export interface Translation {
  id: string,
  text: string;
  timestamp: number;
  user: any;
}

export interface ChallengeLetter {
  char: string,
  sign: string,
  selected: boolean,
  correct: boolean
}

@Component({
  selector: 'app-text-to-lsp',
  templateUrl: './text-to-lsp.component.html',
  styleUrls: ['./text-to-lsp.component.css']
})
export class TextToLspComponent {
  output: ChallengeLetter[][] = [];
  words: Word[] = [];
  textToTranslate: string = 'Buenos dias';
  translationHistory: Translation[] = [];
  timer: number = 0;

  currentWord: Word | null = null;
  currentChar: ChallengeLetter | null = null;
  wordIndex: number = 0;
  charIndex: number = 0;

  constructor(
    public dialog: MatDialog,
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private auth: AuthService
  ) {

    console.log(this.auth.userData)
    this.afAuth.authState.subscribe((user) => {
        if (user) {
          const uid = user.uid
          this.afs.collection<Translation>(
            'translations',
            ref => ref
              .where('user', '==', this.afs.doc(`users/${uid}`).ref)
              .orderBy('timestamp', 'desc'))
            .snapshotChanges().subscribe((snapshots) => {
            this.translationHistory = snapshots.map(snapshot => {
              const data = snapshot.payload.doc.data() as Translation;
              const id = snapshot.payload.doc.id;
              return {...data, id};
            });
          })
        } else {
          localStorage.setItem('user', 'null');
          JSON.parse(localStorage.getItem('user')!);
        }
      }
    )
  }

  openAlphabetDialog() {
    const dialogRef = this.dialog.open(AlphabetComponent);
  }

  openHistoryDialog() {
    const dialogRef = this.dialog.open(TextToLspHistoryComponent, {
      data: {history: this.translationHistory}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.textToTranslate = result.selectedRecord;
        this.translateHistoryRecord(this.textToTranslate);
      }
    })
  }

  translate() {

    if (this.textToTranslate != '') {
      this.output = []
      this.words = []
      let words = this.textToTranslate.trim().split(' ');
      for (let [index, word] of words.entries()) {
        let wordObject = new Word(word, index);
        this.words.push(wordObject);
        let letters = wordObject.getData;
        let challengeLetters = letters.map((letter: Letter, index: number) => {
          const isFirstChar = this.words.length == 1 && index == 0;
          if (isFirstChar) {
            this.charIndex = 0;
            this.wordIndex = 0;
            this.currentWord = wordObject;
          }
          return {
            ...letter,
            selected: isFirstChar,
            correct: false
          }
        })
        this.output?.push(challengeLetters);
      }
    }
    this.currentChar = this.output[0][0];

    this.saveTranslation();
    console.info(this.output)
  }

  translateHistoryRecord(text: string) {
    if (this.textToTranslate != '') {
      this.output = []
      this.words = []
      let words = this.textToTranslate.trim().split(' ');
      for (let [index, word] of words.entries()) {
        let wordObject = new Word(word, index);
        this.words.push(wordObject);
        let letters = wordObject.getData;
        let challengeLetters = letters.map((letter: Letter, index: number) => {
            const isFirstChar = this.words.length == 1 && index == 0;
            if (isFirstChar) {
              this.charIndex = 0;
              this.wordIndex = 0;
              this.currentWord = wordObject;
            }
            return {
              ...letter,
              selected: isFirstChar,
              correct: false
            }
          }
        )
        this.output?.push(challengeLetters);
      }
      this.currentChar = this.output[0][0];
    }
  }

  charDetectedHandler(event: any) {
    console.log(event);
    if (this.currentChar) {
      if (event.toLowerCase() == this.currentChar.char.toLowerCase()) {
        this.currentChar.correct = true;
        this.currentChar.selected = false;
        this.currentChar = this.output[this.wordIndex][this.charIndex + 1];
        this.currentChar.selected = true;
        this.charIndex++;
      }

    }

  }

  //generate a method to save the translation in firestore
  saveTranslation() {
    const translationRef: AngularFirestoreDocument<any> = this.afs.doc(
      `translations/${this.afs.createId()}`
    );
    let userRef = this.afs.doc(`users/${this.auth.userData.uid}`).ref;
    let translationData = {
      text: this.textToTranslate,
      timestamp: new Date().getTime(),
      user: userRef
    }
    return translationRef.set(translationData, {
      merge: true,
    });
  }

  SetUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };
    return userRef.set(userData, {
      merge: true,
    });
  }
}

import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {AngularFirestore} from "@angular/fire/compat/firestore";

@Component({
  selector: 'app-text-to-lsp-history',
  templateUrl: './text-to-lsp-history.component.html',
  styleUrls: ['./text-to-lsp-history.component.css']
})
export class TextToLspHistoryComponent {
  displayedColumns: string[] = [ 'index', 'text', 'timestamp', 'delete', 'translate'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { history: any[] },
    private dialogRef: MatDialogRef<TextToLspHistoryComponent>,
    private afs: AngularFirestore,
  ) {
    console.log(data);
  }

  clickHistoryRecord(row: any) {
    console.log(row)
    this.dialogRef.close({selectedRecord: row.text})
    //close dialog and emit this row
  }


  deleteHistoryRecord(element: any) {
    console.log(element)
    this.afs.collection('translations').doc(element.id).delete()
      .then(() => {
        this.data.history = this.data.history.filter((value, index, arr) => {
          return value.id !== element.id;
        })
      })
  }
}

import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-sign-in-form',
  templateUrl: './sign-in-form.component.html',
  styleUrls: ['./sign-in-form.component.css']
})
export class SignInFormComponent {
  @Output() onSubmit = new EventEmitter();
  error: string = '';
  hide = true;
  form!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.initializeForm();
  }

  private initializeForm() {
    this.form = this.fb.group(
      {
        username: [''],
        password: ['']
      }
    )
  }

  submit() {
    if (this.form.valid) {
      this.onSubmit.emit(this.form.value);
    }
  }
}

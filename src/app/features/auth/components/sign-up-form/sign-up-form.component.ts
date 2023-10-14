import {Component, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-sign-up-form',
  templateUrl: './sign-up-form.component.html',
  styleUrls: ['./sign-up-form.component.css']
})
export class SignUpFormComponent {
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
        name: [''],
        email: [''],
        password: [''],
        rePassword: ['']
      }
    )
  }

  submit() {
    if (this.form.valid) {
      this.onSubmit.emit(this.form.value);
    }
  }
}

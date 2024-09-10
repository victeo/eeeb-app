import {Component, OnInit} from '@angular/core';
import {CheckboxModule} from "primeng/checkbox";
import {ButtonModule} from 'primeng/button';
import {CardModule} from "primeng/card";
import {FloatLabelModule} from "primeng/floatlabel";
import {InputTextModule} from 'primeng/inputtext';
import {PasswordModule} from "primeng/password";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CheckboxModule,
    ButtonModule,
    CardModule,
    FloatLabelModule,
    InputTextModule,
    PasswordModule,
    ReactiveFormsModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.less'
})
export class HomeComponent implements OnInit {
  formControl!: FormGroup;

  constructor(        private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  /**
   * Inicializa o formulário com os campos e validadores necessários.
   */
  private initializeForm(): void {
    this.formControl = this.formBuilder.group({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),

    });
  }

  onSubmit() {

  }
}

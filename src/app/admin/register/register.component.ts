import {Component, OnInit} from '@angular/core';
import {ButtonModule} from 'primeng/button';
import {CardModule} from "primeng/card";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputTextModule} from 'primeng/inputtext';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ButtonModule,
    CardModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.less'
})
export class RegisterComponent implements OnInit {
  formControl!: FormGroup;

  constructor(private formBuilder: FormBuilder,
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
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  onSubmit() {

  }
}

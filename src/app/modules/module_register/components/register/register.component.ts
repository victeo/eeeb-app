import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [
    ReactiveFormsModule, // Adicione isto
    InputTextModule,
    FloatLabelModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      whatsapp: [''],
      address: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        postalCode: ['']
      }),
      Role: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.registerForm.patchValue({
      name: 'Usuário Exemplo',
      email: 'usuario@example.com',
      whatsapp: '11999999999',
      address: {
        street: 'Rua Exemplo',
        city: 'Cidade Exemplo',
        state: 'Estado Exemplo',
        postalCode: '00000-000'
      },
      Role: 'User'
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      console.log('Usuário registrado:', this.registerForm.value);
    } else {
      console.log('Formulário inválido!');
    }
  }
}

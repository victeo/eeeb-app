import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DropdownModule } from 'primeng/dropdown';
import { SelectItem } from 'primeng/api';

// Regex para validar o formato do WhatsApp
const whatsappRegex = /^\(\d{2}\)9\d{8}$/;

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    FloatLabelModule,
    DropdownModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less']
})
export class RegisterComponent {
  registerForm: FormGroup; // Inicialização como não nula
  roles: SelectItem[] = [
    { label: 'Estudante', value: 'Estudante' },
    { label: 'Professor', value: 'Professor' },
    { label: 'Funcionário', value: 'Funcionário' }
  ];
  Users: any[] = [];

  constructor(private formBuilder: FormBuilder) {
    // Inicialização direta no construtor
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      whatsapp: ['', [Validators.required, Validators.pattern(whatsappRegex)]],
      address: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        postalCode: ['']
      }),
      role: ['', Validators.required]
    });

    // Log para verificar a inicialização do formulário
    console.log('Formulário inicializado:', this.registerForm);
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      // Adiciona os dados do formulário à array de usuários
      this.Users.push(this.registerForm.value);

      // Imprime a array no console
      console.log('Lista de usuários:', this.Users);

      // Limpa o formulário para uma nova entrada
      this.registerForm.reset();
    } else {
      console.log('Formulário inválido!');
    }
  }
}

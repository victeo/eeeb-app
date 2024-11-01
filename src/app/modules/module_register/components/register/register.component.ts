import { Component, OnInit, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, ValidationErrors, ValidatorFn, Validators, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { SelectItem } from 'primeng/api';
import { RegisterService } from '../../services/register.service'; // Importa o serviço de registro
import { PasswordModule } from 'primeng/password';

// Regex para validar o formato do WhatsApp e do Email
const whatsappRegex = /^\(\d{2}\)9\d{8}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const CEPRegex = /^\d{5}-\d{3}$/;

@Component({
  standalone: true,
  imports: [
    DropdownModule,
    PasswordModule,
    ToastModule,
    ReactiveFormsModule,
    CommonModule,
    FloatLabelModule,
    InputTextModule
  ],
  providers: [MessageService], // Adicione o MessageService aos provedores
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less']
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;
  roles: SelectItem[] = [];
  Users: any[] = [];

  // Injeção do RegisterService para salvar os dados no Firestore
  constructor(
    private formBuilder: FormBuilder, 
    private messageService: MessageService,
    private registerService: RegisterService // Injetando o RegisterService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(emailRegex)]],
      whatsapp: ['(XX)9', [Validators.required, Validators.pattern(whatsappRegex)]],
      password: ['', [Validators.required, Validators.minLength(8), this.passwordStrengthValidator()]], // Inclui minlength de 8 caracteres
      address: this.formBuilder.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        postalCode: ['', [Validators.required, Validators.pattern(CEPRegex)]]
      }),
      role: ['', Validators.required]
    });
  
    this.roles = [
      { label: 'Estudante', value: 'Estudante' },
      { label: 'Professor', value: 'Professor' },
      { label: 'Funcionário', value: 'Funcionário' }
    ];
  }
  
  // Função para verificar a força da senha
  private passwordStrengthValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value || '';
  
      if (!value) {
        return null; // Não valida campo vazio, apenas obrigatório
      }
  
      // Critérios de senha "média"
      const hasUpperCase = /[A-Z]+/.test(value);
      const hasNumeric = /[0-9]+/.test(value);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]+/.test(value);
      const isValidLength = value.length >= 8;
  
      const passwordValid = (hasUpperCase || hasNumeric || hasSpecialChar) && isValidLength;
  
      return !passwordValid ? { passwordStrength: true } : null;
    };
  }
  

  formatCep(): void {
    const postalCodeControl = this.registerForm.get('address.postalCode');
    let value = postalCodeControl?.value;

    if (value && value.length === 5 && !value.includes('-')) {
      postalCodeControl?.setValue(value + '-', { emitEvent: false });
    }
  }

  async onSubmit(): Promise<void> {
    if (this.registerForm.valid) {
      const { email, password, ...registerUser } = this.registerForm.value;
  
      try {
        const userId = await this.registerService.registerUser(email, password, registerUser);
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: `Usuário cadastrado com ID: ${userId}`
        });
  
        // Limpa o formulário e reinicia o valor padrão de whatsapp
        this.registerForm.reset();
        this.registerForm.patchValue({ whatsapp: '(XX)9' });
  
      } catch (error) {
        // Converte o erro para o tipo `Error` para acessar `message`
        const errorMessage = (error as Error).message;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: errorMessage
        });
      }
    } else {
      if (this.registerForm.get('password')?.hasError('minlength')) {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'A senha deve ter pelo menos 8 caracteres.' });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Por favor, preencha todos os campos corretamente.' });
      }
    }
  }  
}

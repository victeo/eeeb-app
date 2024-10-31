import { Component, OnInit, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, ValidationErrors, ValidatorFn, Validators, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DropdownModule } from 'primeng/dropdown';
import { SelectItem } from 'primeng/api';
import { RegisterService } from '../../services/register.service'; // Importa o serviço de registro
import { PasswordModule } from 'primeng/password';

// Regex para validar o formato do WhatsApp e do Email
const whatsappRegex = /^\(\d{2}\)9\d{8}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const CEPRegex = /^\d{5}-\d{3}$/;

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    DropdownModule,
    PasswordModule,
    ToastModule,
    ReactiveFormsModule,
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
      password: ['', [Validators.required, this.passwordStrengthValidator()]], // Campo de senha com validação de força
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

      const hasUpperCase = /[A-Z]+/.test(value);
      const hasLowerCase = /[a-z]+/.test(value);
      const hasNumeric = /[0-9]+/.test(value);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]+/.test(value);
      const isValidLength = value.length >= 8;

      const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar && isValidLength;

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
      try {
        const userData = this.registerForm.value;
        
        // Chama o método registerUser do RegisterService para salvar os dados no Firestore
        const userId = await this.registerService.createUserDocument('users', userData);
        
        // Adiciona mensagem de sucesso com o ID do usuário
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: `Usuário cadastrado com ID: ${userId}` });
        
        //imprime a array com os dados do usuário
        this.Users.push(userData);
        console.log('Lista de usuários:', this.Users);

        // Reinicia o formulário
        this.registerForm.reset();
        this.registerForm.patchValue({ whatsapp: '(XX)9' });
      } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível registrar o usuário.' });
      }
    } else {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Por favor, preencha todos os campos corretamente.' });
    }
  }
}

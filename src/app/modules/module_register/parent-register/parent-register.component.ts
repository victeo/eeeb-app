import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { Router } from '@angular/router'; // Importa o Router
import { SelectItem } from 'primeng/api';
import { PasswordModule } from 'primeng/password';
import { InputMaskModule } from 'primeng/inputmask';
import { ParentService } from '../services/parent.service/parent.service';
import { FireAuthService } from 'app/services/fire-auth/fire-auth.service';
import { Parent } from 'app/models/parent';
import { FloatLabelModule } from 'primeng/floatlabel';

const whatsappRegex = /^\(\d{2}\)\s?9\d{4}-\d{4}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const CEPRegex = /^\d{5}-\d{3}$/;
const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;

@Component({
  standalone: true,
  imports: [
    DropdownModule,
    PasswordModule,
    ToastModule,
    ReactiveFormsModule,
    CommonModule,
    InputTextModule,
    InputMaskModule,
    FloatLabelModule
  ],
  providers: [MessageService],
  templateUrl: './parent-register.component.html',
  styleUrls: ['./parent-register.component.less']
})
export class ParentRegisterComponent implements OnInit {

  parentForm!: FormGroup;
  genders: SelectItem[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private parentService: ParentService,
    private fireAuthService: FireAuthService,
    private router: Router // Adiciona o Router ao construtor
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.genders = [
      { label: 'Masculino', value: 'Masculino' },
      { label: 'Feminino', value: 'Feminino' },
      { label: 'Outro', value: 'Outro' }
    ];
  }

  private initForm(): void {
    this.parentForm = this.formBuilder.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      cpf: ['', [Validators.required, Validators.pattern(cpfRegex)]],
      email: ['', [Validators.required, Validators.pattern(emailRegex)]],
      whatsapp: ['(XX)', [Validators.required, Validators.pattern(whatsappRegex)]],
      password: ['', [Validators.required, Validators.minLength(8), this.passwordStrengthValidator()]],
      renda: ['', [Validators.required, Validators.min(0)]],
      address: this.formBuilder.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        postalCode: ['', [Validators.required, Validators.pattern(CEPRegex)]]
      }),
      gender: ['', Validators.required]
    });
  }

  private passwordStrengthValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value || '';
      if (!value) return null;
      const hasUpperCase = /[A-Z]+/.test(value);
      const hasNumeric = /[0-9]+/.test(value);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]+/.test(value);
      const isValidLength = value.length >= 8;
      const passwordValid = (hasUpperCase || hasNumeric || hasSpecialChar) && isValidLength;
      return !passwordValid ? { passwordStrength: true } : null;
    };
  }

  formatCep(): void {
    const postalCodeControl = this.parentForm.get('address.postalCode');
    let value = postalCodeControl?.value;
    if (value && value.length === 5 && !value.includes('-')) {
      postalCodeControl?.setValue(value + '-', { emitEvent: false });
    }
  }

  async onSubmit(): Promise<void> {
    if (this.parentForm.valid) {
      const { email, password, ...parentData } = this.parentForm.value;
  
      try {
        const userCredential = await this.fireAuthService.register<Parent>(email, password, parentData as Parent);
        
        await this.parentService.saveParentData(userCredential.user.uid, parentData as Parent);
  
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Responsável cadastrado com sucesso'
        });
  
        this.parentForm.reset();
  
      } catch (error) {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: (error as Error).message
        });
      }
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Por favor, preencha todos os campos corretamente.'
      });
    }
  }

  // Método de navegação para o componente ParentingComponent
  irParaParenting(): void {
    this.router.navigate(['/painel/parenting']);
  }
}

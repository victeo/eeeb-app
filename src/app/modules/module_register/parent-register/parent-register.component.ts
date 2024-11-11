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
import { SelectItem } from 'primeng/api';
import { PasswordModule } from 'primeng/password';
import { InputMaskModule } from 'primeng/inputmask';
import { ParentService } from '../services/parent.service/parent.service';
import { Parent } from 'app/models/parent';

// Regex para validação
const whatsappRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
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
    InputMaskModule
  ],
  providers: [MessageService],
  templateUrl: './parent-register.component.html',
  styleUrls: ['./parent-register.component.less']
})
export class ParentRegisterComponent implements OnInit {

  parentForm!: FormGroup;
  genders: SelectItem[] = [];
  selectedFile?: File; // Declaração da variável para armazenar o arquivo selecionado

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private parentService: ParentService
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
      const parentData: Parent = this.parentForm.value;

      try {
        const parentId = await this.parentService.registerParent(parentData);
        
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Responsável cadastrado com sucesso'
        });
        
        this.parentForm.reset();
        this.parentForm.patchValue({ whatsapp: '(XX)9' });
      } catch (error) {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: (error as Error).message
        });
      }
    } else {
      const passwordError = this.parentForm.get('password')?.hasError('minlength');
      const detail = passwordError
        ? 'A senha deve ter pelo menos 8 caracteres.'
        : 'Por favor, preencha todos os campos corretamente.';
      this.messageService.add({ severity: 'error', summary: 'Erro', detail });
    }
  }
}
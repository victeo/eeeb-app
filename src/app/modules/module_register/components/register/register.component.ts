import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { ReactiveFormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { RegisterService } from '../../services/register.service/register.service';
import { InputMaskModule } from 'primeng/inputmask';

@Component({
  standalone: true,
  imports: [
    DropdownModule,
    ToastModule,
    ReactiveFormsModule,
    CommonModule,
    FloatLabelModule,
    InputTextModule,
    InputMaskModule
  ],
  providers: [MessageService],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less']
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;
  turmas: { label: string, value: string }[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private registerService: RegisterService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.initializeTurmas();
  }

  private initForm(): void {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      birthDate: ['', Validators.required],
      class: ['', Validators.required],
      cpf: ['', Validators.required],
      phone: ['', [Validators.required, this.telefoneValidator]],
      responsaveis: this.formBuilder.group({
        responsavel1: ['', [Validators.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/)]],
        responsavel2: ['', [Validators.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/)]]
      }, { validators: this.minimoUmResponsavelValidator }) // Validação personalizada
    });
  }
  private telefoneValidator(control: AbstractControl): ValidationErrors | null {
    const telefone = control.value;
    const telefoneRegex = /^\(\d{2}\)9\d{4}-\d{4}$/; // Formato (XX)9XXXX-XXXX
    return telefoneRegex.test(telefone) ? null : { formatoInvalido: true };
  }

  private minimoUmResponsavelValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const responsavel1 = control.get('responsavel1')?.value;
    const responsavel2 = control.get('responsavel2')?.value;
    if (!responsavel1 && !responsavel2) {
      return { minimoUmResponsavel: true }; // Erro se ambos os campos estão vazios
    }
    return null;
  };

  private initializeTurmas(): void {
    this.turmas = [
      { label: 'Pré Escola 1', value: 'pré escola 1' },
      { label: 'Pré Escola 2', value: 'pré escola 2' },
      { label: 'Pré Escola 3', value: 'pré escola 3' },
      { label: '1º Ano', value: '1º ano' },
      { label: '2º Ano', value: '2º ano' },
      { label: '3º Ano', value: '3º ano' },
      { label: '4º Ano', value: '4º ano' },
      { label: '5º Ano', value: '5º ano' },
      { label: '6º Ano', value: '6º ano' },
      { label: '7º Ano', value: '7º ano' },
      { label: '8º Ano', value: '8º ano' },
      { label: '9º Ano', value: '9º ano' }
    ];
  }

  async onSubmit(): Promise<void> {
    if (this.registerForm.valid) {
      const registerStudent = this.registerForm.value;
  
      try {
        const studentId = await this.registerService.registerStudent(registerStudent);
        const studentName = registerStudent.name;
  
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: `Aluno ${studentName} foi cadastrado com sucesso`
        });
  
        this.registerForm.reset();
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
}

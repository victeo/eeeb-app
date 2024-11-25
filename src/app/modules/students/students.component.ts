import { Component, OnInit } from '@angular/core';
import { FirestoreService } from 'app/services/fire-store/firestore.service';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { Parent } from 'app/models/parent';
import { Router } from '@angular/router';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import {CardModule} from "primeng/card";
import {Button} from "primeng/button";
import { TooltipModule } from 'primeng/tooltip';


@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule,
    DropdownModule,
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    Button,
    TooltipModule
  ],
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.less'],
})
export class StudentsComponent implements OnInit {
  students: any[] = [];
  filteredStudents: any[] = [];
  studentsDropdown: { name: string; value: any }[] = [];
  selectedStudent: any | null = null;
  isEditing: boolean = false;
  editForm!: FormGroup;

  classOptions = [
    { label: 'Pré Escola 1', value: 'Pré Escola 1' },
    { label: 'Pré Escola 2', value: 'Pré Escola 2' },
    { label: '1º Ano', value: '1º Ano' },
    { label: '2º Ano', value: '2º Ano' },
    { label: '3º Ano', value: '3º Ano' },
    { label: '4º Ano', value: '4º Ano' },
    { label: '5º Ano', value: '5º Ano' },
    { label: '6º Ano', value: '6º Ano' },
    { label: '7º Ano', value: '7º Ano' },
    { label: '8º Ano', value: '8º Ano' },
    { label: '9º Ano', value: '9º Ano' },
  ];

  constructor(
    private firestoreService: FirestoreService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.loadStudents();
  }

  private initializeForm(): void {
    this.editForm = this.fb.group({
      name: ['', [Validators.required]],
      birthDate: ['', [Validators.required]],
      class: ['', [Validators.required]],
      cpf: ['', [Validators.required, this.cpfValidator]],
      phone: ['', [Validators.required, this.telefoneValidator]],
    });
  }

  async loadStudents() {
    try {
      this.students = await this.firestoreService.searchCollection('students');
      this.filteredStudents = [...this.students];
      this.studentsDropdown = this.students.map((student) => ({
        name: student.name,
        value: student,
      }));
    } catch (error) {
      console.error('Erro ao carregar alunos:', error);
    }
  }

  filterTable(): void {
    if (this.selectedStudent) {
      this.filteredStudents = [this.selectedStudent];
    } else {
      this.filteredStudents = [...this.students];
    }
  }

  updateCPF(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Remove caracteres que não sejam números
    value = value.replace(/\D/g, '');

    // Adiciona os pontos e o traço automaticamente
    if (value.length > 3) {
      value = value.replace(/^(\d{3})(\d)/, '$1.$2');
    }
    if (value.length > 6) {
      value = value.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
    }
    if (value.length > 9) {
      value = value.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})$/, '$1.$2.$3-$4');
    }

    // Limita o tamanho a 14 caracteres
    value = value.substring(0, 14);

    // Atualiza o campo de entrada
    input.value = value;

    // Atualiza o controle do formulário
    this.editForm.get('cpf')?.setValue(value, { emitEvent: false });
  }


  updateBirthDate(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Remove caracteres que não sejam números
    value = value.replace(/\D/g, '');

    // Adiciona as barras automaticamente
    if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d)/, '$1/$2');
    }
    if (value.length > 5) {
      value = value.replace(/^(\d{2})\/(\d{2})(\d)/, '$1/$2/$3');
    }

    // Limita o tamanho a 10 caracteres
    value = value.substring(0, 10);

    // Atualiza o campo de entrada
    input.value = value;

    // Atualiza o controle do formulário
    this.editForm.get('birthDate')?.setValue(value, { emitEvent: false });
  }


  updatePhone(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Remove caracteres que não sejam números
    value = value.replace(/\D/g, '');

    // Adiciona os parênteses automaticamente
    if (value.length > 0) {
      value = value.replace(/^(\d{2})(\d)/, '($1)$2');
    }

    // Adiciona o traço automaticamente
    if (value.length > 9) {
      value = value.replace(/^(\(\d{2}\))(\d{5})(\d)/, '$1$2-$3');
    }

    // Limita o tamanho a 14 caracteres
    value = value.substring(0, 14);

    // Atualiza o campo de entrada
    input.value = value;

    // Atualiza o controle do formulário
    this.editForm.get('phone')?.setValue(value, { emitEvent: false });
  }


  async deleteStudent(studentId: string | undefined): Promise<void> {
    if (!studentId) {
      console.error('ID inválido ou indefinido.');
      return;
    }

    const confirmDelete = confirm('Tem certeza de que deseja excluir este aluno?');
    if (confirmDelete) {
      try {
        await this.firestoreService.deleteDocument(`students/${studentId}`);
        this.students = this.students.filter(student => student.id !== studentId);
        this.filteredStudents = [...this.students];
        alert('Aluno excluído com sucesso.');
      } catch (error) {
        console.error('Erro ao excluir aluno:', error);
        alert('Erro ao excluir aluno.');
      }
    }
  }

  editStudent(student: any): void {
    this.selectedStudent = student; // Define o aluno selecionado
    this.isEditing = true;

    // Preenche o formulário com os valores do aluno
    this.editForm.patchValue({
      name: student.name,
      birthDate: student.birthDate,
      class: student.class,
      cpf: student.cpf,
      phone: student.phone,
    });
  }


  async saveEdit(): Promise<void> {
    if (!this.editForm || this.editForm.invalid) {
      alert('Por favor, preencha todos os campos corretamente.');
      return;
    }

    const updatedStudent = { id: this.selectedStudent.id, ...this.editForm.value };

    try {
      await this.firestoreService.updateDocument(
        `students/${updatedStudent.id}`,
        updatedStudent
      );
      this.students = this.students.map((student) =>
        student.id === updatedStudent.id ? updatedStudent : student
      );
      this.filteredStudents = [...this.students];
      this.isEditing = false;
      alert('Aluno atualizado com sucesso.');
    } catch (error) {
      console.error('Erro ao salvar alterações:', error);
      alert('Erro ao salvar alterações.');
    }
  }

  cancelEdit(): void {
    this.isEditing = false;
  }

  private cpfValidator(control: AbstractControl): ValidationErrors | null {
    const cpf = control.value;
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    return cpfRegex.test(cpf) ? null : { formatoInvalido: true };
  }

  private telefoneValidator(control: AbstractControl): ValidationErrors | null {
    const telefone = control.value;
    const telefoneRegex = /^\(\d{2}\)9?\d{4}-\d{4}$/;
    return telefoneRegex.test(telefone) ? null : { formatoInvalido: true };
  }

  goToRegister(): void {
    this.router.navigate(['/painel/register']);
  }

  activeStudent: any = null; // Aluno ativo para exibição dos responsáveis
responsaveisExibidos: string[] = []; // Responsáveis a serem exibidos

async toggleResponsaveis(student: any): Promise<void> {
  if (this.activeStudent === student) {
    // Fecha a janela se já estiver aberta
    this.activeStudent = null;
    this.responsaveisExibidos = [];
    return;
  }

  if (!student.responsaveis || student.responsaveis.length === 0) {
    this.responsaveisExibidos = ['Nenhum responsável encontrado'];
    this.activeStudent = student;
    return;
  }

  try {
    // Busca os detalhes dos responsáveis com base nos IDs
    this.responsaveisExibidos = await Promise.all(
      student.responsaveis.map(async (responsavelId: string) => {
        const responsavel = await this.firestoreService.getDocument<Parent>(
          `parents/${responsavelId}`
        );
        return responsavel
          ? `${responsavel.name} ${responsavel.surname}`
          : 'Responsável não encontrado';
      })
    );

    // Define o aluno ativo para abrir a janela
    this.activeStudent = student;
  } catch (error) {
    console.error('Erro ao buscar responsáveis:', error);
    this.responsaveisExibidos = ['Erro ao carregar responsáveis'];
    this.activeStudent = student;
  }
}
}

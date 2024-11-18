import { Component, OnInit } from '@angular/core';
import { FirestoreService } from 'app/services/fire-store/firestore.service';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, DropdownModule, FormsModule, ReactiveFormsModule],
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.less']
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
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.loadStudents();
  }

  async loadStudents() {
    try {
      this.students = await this.firestoreService.searchCollection('students');
      this.filteredStudents = [...this.students];
      this.studentsDropdown = this.students.map(student => ({
        name: student.name,
        value: student
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
  async deleteStudent(studentId: string | undefined): Promise<void> {
    if (!studentId) {
      console.error('ID inválido ou indefinido.');
      return;
    }
  
    const confirmDelete = confirm('Tem certeza de que deseja excluir este aluno?');
    if (confirmDelete) {
      try {
        // Remove o documento do Firestore
        await this.firestoreService.deleteDocument(`students/${studentId}`);
  
        // Remove o aluno da lista local
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
    this.isEditing = true;
    this.editForm = this.fb.group({
      name: [student.name, [Validators.required]],
      birthDate: [student.birthDate, [Validators.required]],
      class: [student.class, [Validators.required]],
      cpf: [student.cpf, [Validators.required, this.cpfValidator]],
      phone: [student.phone, [Validators.required, this.telefoneValidator]]
    });
  }
  

  async saveEdit(): Promise<void> {
    if (!this.editForm || this.editForm.invalid) {
      alert('Por favor, preencha todos os campos corretamente.');
      return;
    }

    const updatedStudent = { id: this.selectedStudent.id, ...this.editForm.value };

    try {
      await this.firestoreService.updateDocument(`students/${updatedStudent.id}`, updatedStudent);
      this.students = this.students.map(student =>
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
    //this.editForm = [];
  }

  // Validador de CPF
  private cpfValidator(control: AbstractControl): ValidationErrors | null {
    const cpf = control.value;
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/; // Formato XXX.XXX.XXX-XX
    return cpfRegex.test(cpf) ? null : { formatoInvalido: true };
  }

  // Validador de Telefone
  private telefoneValidator(control: AbstractControl): ValidationErrors | null {
    const telefone = control.value;
    const telefoneRegex = /^\(\d{2}\)9\d{4}-\d{4}$/; // Formato (XX)9XXXX-XXXX
    return telefoneRegex.test(telefone) ? null : { formatoInvalido: true };
  }
}
import { Component, OnInit } from '@angular/core';
import { ParentService } from '../module_register/services/parent.service/parent.service';
import { Parent } from 'app/models/parent';
import {
  DropdownModule,
} from 'primeng/dropdown';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule, DropdownModule, FormsModule, ReactiveFormsModule],
  selector: 'app-parents',
  templateUrl: './parents.component.html',
  styleUrls: ['./parents.component.less'],
})
export class ParentsComponent implements OnInit {
  parents: Parent[] = [];
  filteredParents: Parent[] = [];
  parentsDropdown: { name: string; value: Parent }[] = [];
  selectedParent: Parent | null = null;
  isEditing: boolean = false;
  editForm!: FormGroup;

  constructor(
    private parentService: ParentService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    console.log(this.editForm);  // Check if form is initialized correctly
    this.loadParents();

    this.editForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      whatsapp: ['', Validators.required],
      cpf: ['', [Validators.required, this.cpfValidator]],
      renda: ['', Validators.required],
      gender: ['', Validators.required],
      address: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        postalCode: ['', Validators.required],
      }),
    });
  }

  private initializeForm(): void {
    this.editForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      cpf: ['', [Validators.required, this.cpfValidator]],
      email: ['', [Validators.required, Validators.email]],
      whatsapp: ['', [Validators.required, this.whatsappValidator]],
      address: this.fb.group({
        street: [''],
        city: [''],
        state: [''],
        postalCode: [''],
      }),
      renda: [0, [Validators.required, Validators.min(0)]],
      gender: ['', Validators.required],
    });
  }

  private async loadParents(): Promise<void> {
    try {
      this.parents = await this.parentService.getAllParents();
      this.filteredParents = [...this.parents];
      this.parentsDropdown = this.parents.map((parent) => ({
        name: `${parent.name} ${parent.surname}`,
        value: parent,
      }));
    } catch (error) {
      console.error('Erro ao carregar responsáveis:', error);
    }
  }

  filterTable(): void {
    if (this.selectedParent) {
      this.filteredParents = [this.selectedParent];
    } else {
      this.filteredParents = [...this.parents];
    }
  }

  editParent(parent: Parent): void {
    if (!this.editForm) {
      console.error('Formulário não inicializado.');
      return;
    }
    this.selectedParent = parent;
    this.isEditing = true;

    this.editForm.patchValue({
      name: parent?.name,
      surname: parent?.surname,
      cpf: parent?.cpf,
      email: parent.email,
      whatsapp: parent?.whatsapp,
      address: {
        street: parent.address?.street || '',
        city: parent.address?.city || '',
        state: parent.address?.state || '',
        postalCode: parent.address?.postalCode || '',
      },
      renda: parent?.renda,
      gender: parent?.gender,
    });
  }

  async saveEdit(): Promise<void> {
    if (!this.editForm || this.editForm.invalid) {
      alert('Por favor, preencha todos os campos corretamente.');
      return;
    }

    if (!this.selectedParent) {
      console.error('Nenhum responsável selecionado para edição.');
      return;
    }

    const updatedParent: Parent = {
      ...this.selectedParent,
      ...this.editForm.value,
      address: {
        street: this.editForm.get('address.street')?.value,
        city: this.editForm.get('address.city')?.value,
        state: this.editForm.get('address.state')?.value,
        postalCode: this.editForm.get('address.postalCode')?.value,
      },
    };

    try {
      await this.parentService.updateParent(updatedParent.id!, updatedParent);

      this.parents = this.parents.map((parent) =>
        parent.id === updatedParent.id ? updatedParent : parent
      );
      this.filteredParents = [...this.parents];

      this.isEditing = false;
      alert('Responsável atualizado com sucesso.');
    } catch (error) {
      console.error('Erro ao salvar alterações:', error);
      alert('Erro ao salvar alterações.');
    }
  }

  cancelEdit(): void {
    this.isEditing = false;
  }

  async deleteParent(parentId: string | undefined): Promise<void> {
    if (!parentId) {
      console.error('ID inválido para exclusão.');
      return;
    }
    const confirmDelete = confirm(
      'Tem certeza de que deseja excluir este responsável?'
    );
    if (confirmDelete) {
      try {
        await this.parentService.deleteParent(parentId);
        this.filteredParents = this.filteredParents.filter(
          (p) => p.id !== parentId
        );
        this.parents = this.parents.filter((p) => p.id !== parentId);
        alert('Responsável excluído com sucesso.');
      } catch (error) {
        console.error('Erro ao excluir responsável:', error);
        alert('Erro ao excluir responsável.');
      }
    }
  }

  private cpfValidator(control: AbstractControl): ValidationErrors | null {
    const cpf = control.value;
    if (!cpf) {
      return null;
    }
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    return cpfRegex.test(cpf) ? null : { formatoInvalido: true };
  }

  private whatsappValidator(control: AbstractControl): ValidationErrors | null {
    const whatsapp = control.value;
    const whatsappRegex = /^\(\d{2}\)9\d{4}-\d{4}$/;
    return whatsappRegex.test(whatsapp) ? null : { formatoInvalido: true };
  }
}

import { Component, OnInit } from '@angular/core';
import { ParentService } from '../module_register/services/parent.service/parent.service';
import { Parent } from 'app/models/parent';
import { Router } from '@angular/router';
import { PrimeIcons } from 'primeng/api';
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
    private fb: FormBuilder,
    private router: Router
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
      cpf: ['', [Validators.required]],
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
      cpf: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      whatsapp: ['', [Validators.required]],
      address: this.fb.group({
        street: [''],
        city: [''],
        state: [''],
        postalCode: ['', Validators.required, this.cepValidator],
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

  updateWhatsApp(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;
  
    // Remove caracteres inválidos
    value = value.replace(/[^\d]/g, '');
  
    // Adiciona os parênteses automaticamente se houver até 2 dígitos no início
    if (value.length > 0 && value.length <= 2) {
      value = `(${value}`;
    } else if (value.length > 2) {
      value = `(${value.slice(0, 2)})${value.slice(2)}`;
    }
  
    // Adiciona o traço automaticamente
    if (value.length > 9) {
      value = value.replace(
        /^(\(\d{2}\))(\d{4,5})(\d{0,4})$/,
        '$1$2-$3'
      );
    }
  
    // Limita o tamanho máximo a "(XX)XXXXX-XXXX"
    value = value.substring(0, 14);
  
    // Atualiza o valor do campo e do formulário
    input.value = value;
    this.editForm.get('whatsapp')?.setValue(value, { emitEvent: false });
  }  
  
  updateCPF(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;
  
    // Garantir o formato "xxx.xxx.xxx-xx"
    value = value.replace(/[^\d]/g, ''); // Apenas números
    value = value.replace(/(\d{3})(\d)/, '$1.$2'); // Primeiro ponto
    value = value.replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3'); // Segundo ponto
    value = value.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4'); // Traço
    input.value = value.substring(0, 14); // Limitar o tamanho máximo
  
    // Atualizar o valor do formulário
    this.editForm.get('cpf')?.setValue(input.value, { emitEvent: false });
  }

  updateCEP(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;
  
    // Remove qualquer caractere que não seja número
    value = value.replace(/[^\d]/g, '');
  
    // Adiciona o traço automaticamente após os 5 primeiros números
    if (value.length > 5) {
      value = value.replace(/^(\d{5})(\d{0,3})$/, '$1-$2');
    }
  
    // Limita o tamanho máximo a "xxxxx-xxx"
    value = value.substring(0, 9);
  
    // Atualiza o valor do campo e do formulário
    input.value = value;
    this.editForm.get('address.postalCode')?.setValue(value, { emitEvent: false });
  }

  private cepValidator(control: AbstractControl): ValidationErrors | null {
    const cep = control.value;
    if (!cep) return null;
  
    // Valida o formato "xxxxx-xxx"
    const cepRegex = /^\d{5}-\d{3}$/;
    return cepRegex.test(cep) ? null : { formatoInvalido: true };
  }
  
  goToParentsRegister(): void {
    this.router.navigate(['/painel/parentRegister']);
  }

  // Método de navegação para o componente ParentingComponent
  irParaParenting(): void {
    this.router.navigate(['/painel/parenting']);
  }
}

import { Component, OnInit } from '@angular/core';
import { ParentService } from '../module_register/services/parent.service/parent.service';
import { Parent } from 'app/models/parent';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule, DropdownModule, FormsModule],
  selector: 'app-parents',
  templateUrl: './parents.component.html',
  styleUrls: ['./parents.component.less']
})
export class ParentsComponent implements OnInit {

  parents: Parent[] = [];
  filteredParents: Parent[] = [];
  parentsDropdown: { name: string; value: Parent }[] = [];
  selectedParent: Parent | null = null;

  constructor(private parentService: ParentService) {}

  ngOnInit(): void {
    this.loadParents();
  }

  // Método para carregar os dados dos responsáveis
  private async loadParents(): Promise<void> {
    try {
      this.parents = await this.parentService.getAllParents();
      this.filteredParents = [...this.parents];
      this.parentsDropdown = this.parents.map(parent => ({
        name: `${parent.name} ${parent.surname}`,
        value: parent
      }));
    } catch (error) {
      console.error('Erro ao carregar responsáveis:', error);
      this.parents = [];
      this.filteredParents = [];
      this.parentsDropdown = [];
    }
  }

  // Método para filtrar a tabela
  filterTable(): void {
    if (this.selectedParent) {
      this.filteredParents = [this.selectedParent];
    } else {
      this.filteredParents = [...this.parents];
    }
  }

  async editParent(parent: Parent): Promise<void> {
    console.log('Editando:', parent);
    // Lógica de edição
  }

  async deleteParent(parentId: string | undefined): Promise<void> {
    if (!parentId) {
      console.error('ID inválido para exclusão.');
      return;
    }
    const confirmDelete = confirm('Tem certeza de que deseja excluir este responsável?');
    if (confirmDelete) {
      try {
        await this.parentService.deleteParent(parentId);
        this.filteredParents = this.filteredParents.filter(p => p.id !== parentId);
        this.parents = this.parents.filter(p => p.id !== parentId);
        alert('Responsável excluído com sucesso.');
      } catch (error) {
        console.error('Erro ao excluir responsável:', error);
        alert('Erro ao excluir responsável.');
      }
    }
  }
}

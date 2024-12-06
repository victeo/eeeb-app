import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirestoreService } from 'app/services/fire-store/firestore.service';
import { DropdownModule } from 'primeng/dropdown'; 

@Component({
  selector: 'app-parenting',
  standalone: true,
  templateUrl: './parenting.component.html',
  styleUrls: ['./parenting.component.less'],
  imports: [CommonModule, DropdownModule, FormsModule]
})
export class ParentingComponent {
  searchAluno = '';
  searchResponsavel = '';
  alunosResultados: any[] = [];
  responsaveisResultados: any[] = [];
  alunoSelecionado: any = null;
  responsavelSelecionado: any = null;

  constructor(private firestoreService: FirestoreService) {}

  // Método para buscar alunos na coleção "students"
  async buscarAlunos() {
    try {
      console.log('Buscando todos os alunos na coleção "students"...');
      const resultados = await this.firestoreService.getCollection('students');
      console.log('Resultados retornados:', resultados);
  
      this.alunosResultados = resultados.map((aluno: any) => ({
        id: aluno.id,
        name: `${aluno.name} (${aluno.id.slice(0, 5)})`,
      }));
      console.log('Resultados formatados para exibição:', this.alunosResultados);
    } catch (error) {
      console.error('Erro ao buscar alunos:', error);
    }
  }
  
  // Método para buscar responsáveis na coleção "parents"
  async buscarResponsaveis() {
    try {
      console.log('Buscando todos os responsáveis na coleção "parents"...');
      const resultados = await this.firestoreService.getCollection('parents');
      console.log('Resultados retornados:', resultados);
  
      this.responsaveisResultados = resultados.map((responsavel: any) => ({
        id: responsavel.id,
        name: `${responsavel.name} ${responsavel.surname} (${responsavel.id.slice(0, 5)})`,
      }));
      console.log('Resultados formatados para exibição:', this.responsaveisResultados);
    } catch (error) {
      console.error('Erro ao buscar responsáveis:', error);
    }
  }
  
  
  selecionarAluno(aluno: any) {
    this.alunoSelecionado = aluno;
    this.alunosResultados = [];
  }

  selecionarResponsavel(responsavel: any) {
    this.responsavelSelecionado = responsavel;
    this.responsaveisResultados = [];
  }

  async ligarAlunoResponsavel() {
    if (!this.alunoSelecionado || !this.responsavelSelecionado) {
      alert('Por favor, selecione um aluno e um responsável antes de fazer a ligação.');
      return;
    }

    try {
      const alunoId = this.alunoSelecionado.id;
      const responsavelId = this.responsavelSelecionado.id;

      // Adiciona o aluno ao campo `alunos` do responsável
      await this.firestoreService.addIdToArray(`parents/${responsavelId}`, 'alunos', alunoId);

      // Adiciona o responsável ao campo `responsaveis` do aluno na coleção "students"
      await this.firestoreService.addIdToArray(`students/${alunoId}`, 'responsaveis', responsavelId);

      alert(`Ligação entre ${this.alunoSelecionado.name} e ${this.responsavelSelecionado.name} feita com sucesso!`);

      // Limpa as seleções após a ligação
      this.alunoSelecionado = null;
      this.responsavelSelecionado = null;
      this.searchAluno = '';
      this.searchResponsavel = '';
      this.alunosResultados = [];
      this.responsaveisResultados = [];
    } catch (error) {
      console.error('Erro ao tentar ligar aluno e responsável:', error);
      alert('Ocorreu um erro ao tentar ligar o aluno e o responsável. Por favor, tente novamente.');
    }
  }
}

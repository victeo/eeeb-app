import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirestoreService } from 'app/services/fire-store/firestore.service';

@Component({
  selector: 'app-parenting',
  standalone: true,
  templateUrl: './parenting.component.html',
  styleUrls: ['./parenting.component.less'],
  imports: [CommonModule, FormsModule]
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
    if (this.searchAluno.trim()) {
      try {
        // Agora buscando na coleção "students"
        this.alunosResultados = await this.firestoreService.searchCollection('students', 'name', this.searchAluno);
  
        if (this.alunosResultados.length === 0) {
          console.warn('Nenhum aluno encontrado para o nome:', this.searchAluno);
        } else {
          console.log('Alunos encontrados:', this.alunosResultados);
        }
      } catch (error) {
        console.error('Erro ao buscar alunos:', error);
      }
    } else {
      this.alunosResultados = [];
    }
  }
  
  // Método para buscar responsáveis na coleção "parents"
  async buscarResponsaveis() {
    if (this.searchResponsavel.trim()) {
      try {
        this.responsaveisResultados = await this.firestoreService.searchCollection('parents', 'name', this.searchResponsavel);
  
        if (this.responsaveisResultados.length === 0) {
          console.warn('Nenhum responsável encontrado para o nome:', this.searchResponsavel);
        } else {
          console.log('Responsáveis encontrados:', this.responsaveisResultados);
        }
      } catch (error) {
        console.error('Erro ao buscar responsáveis:', error);
      }
    } else {
      this.responsaveisResultados = [];
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

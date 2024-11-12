import { Component } from '@angular/core';
import { FirestoreService } from 'app/services/fire-store/firestore.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-parenting',
  standalone: true,
  templateUrl: './parenting.component.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./parenting.component.less']
})
export class ParentingComponent {
  searchAluno = '';
  searchResponsavel = '';
  alunosResultados: any[] = [];
  responsaveisResultados: any[] = [];
  alunoSelecionado: any = null;
  responsavelSelecionado: any = null;

  constructor(private firestoreService: FirestoreService) {}

  async buscarAlunos() {
    this.alunosResultados = await this.firestoreService.searchCollection('user', 'nome', this.searchAluno);
  }

  async buscarResponsaveis() {
    this.responsaveisResultados = await this.firestoreService.searchCollection('parents', 'nome', this.searchResponsavel);
  }

  selecionarAluno(aluno: any) {
    this.alunoSelecionado = aluno;
  }

  selecionarResponsavel(responsavel: any) {
    this.responsavelSelecionado = responsavel;
  }

  async ligarAlunoResponsavel() {
    if (this.alunoSelecionado && this.responsavelSelecionado) {
      const alunoId = this.alunoSelecionado.id;
      const responsavelId = this.responsavelSelecionado.id;
      
      // Adiciona o aluno ao campo `alunos` do responsável
      await this.firestoreService.addIdToArray(`parents/${responsavelId}`, 'alunos', alunoId);
  
      // Adiciona o responsável ao campo `responsaveis` do aluno
      await this.firestoreService.addIdToArray(`user/${alunoId}`, 'responsaveis', responsavelId);
  
      alert(`Ligação entre ${this.alunoSelecionado.nome} e ${this.responsavelSelecionado.nome} feita com sucesso!`);
  
      // Limpa as seleções após a ligação
      this.alunoSelecionado = null;
      this.responsavelSelecionado = null;
    }
  }
}

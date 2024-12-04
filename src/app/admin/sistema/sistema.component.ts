import { Component, OnInit } from '@angular/core';
import { SistemaService } from './services/sistema.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';

@Component({
  selector: 'app-sistema',
  templateUrl: './sistema.component.html',
  standalone: true,
  imports : [FormsModule, CommonModule],
  styleUrls: ['./sistema.component.less'],
})
export class SistemaComponent implements OnInit {
  users: Array<{ id: string; name: string; email: string; role: string }> = [];
  newUser = { name: '', email: '', role: 'professor' };

  constructor(private sistemaService: SistemaService, private firestore: Firestore, private auth: Auth ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  createAdmin() {
    const email = 'anaclaralimaduartx@gmail.com';
    const name = 'Anc Clara Lima Limão';
    const password = '20566834123g'; // Defina uma senha segura ou gere automaticamente.

    this.sistemaService.createAdminUser(email, password, name).then(() => {
      console.log('Usuário admin criado com sucesso!');
    }).catch((error) => {
      console.error('Erro ao criar usuário admin:', error);
    });
  }

  changeRole(userId: string, newRole: string) {
    this.sistemaService.updateUserRole(userId, newRole).subscribe(() => {
      console.log('Role atualizada com sucesso!');
    }, (error) => {
      console.error('Erro ao atualizar role:', error);
    });
  }

  loadUsers() {
    this.sistemaService.getUsers().subscribe((data) => {
      this.users = data;
    });
  }

  loadAllUsers() {
    this.sistemaService.getAllUsers().then((data) => {
      this.users = data;
    });
  }
  
  editUser(user: any): void {
    console.log('Editando usuário:', user);
  }
  
  createUser() {
    // Simule a criação de um UID caso não exista
    const uid = this.generateUID(); // Pode substituir pela lógica correta para obter o UID
  
    this.sistemaService.createUser({ ...this.newUser, uid }).subscribe(() => {
      this.loadUsers(); // Atualiza a lista de usuários
      this.newUser = { name: '', email: '', role: 'professor' }; // Limpa o formulário
    });
  }
  
  // Método para gerar um UID (caso necessário)
  generateUID(): string {
    return Math.random().toString(36).substr(2, 9); // Apenas para simulação
  }
  

  updateUserRole(userId: string, newRole: string) {
    this.sistemaService.updateUserRole(userId, newRole).subscribe(() => {
      this.loadUsers(); // Atualiza a lista após a edição
    });
  }

  deleteUser(userId: string) {
    this.sistemaService.deleteUser(userId).subscribe(() => {
      this.loadUsers(); // Atualiza a lista após exclusão
    });
  }  
}
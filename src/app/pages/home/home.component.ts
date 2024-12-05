import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { UserCredential } from "@angular/fire/auth";

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { CardModule } from "primeng/card";
import { FloatLabelModule } from "primeng/floatlabel";
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from "primeng/password";
import { MessageService } from "primeng/api";
import { ToastModule } from "primeng/toast";

// Services
import { FireAuthService } from "../../services/fire-auth/fire-auth.service";
import { AuthService } from "../../services/auth/auth.service";

// Models
import { Login } from "../../models/login";
import { Router } from "@angular/router";

// Enum para roles
export enum UserRole {
  Admin = 'admin',
  User = 'user',
  Professor = 'professor',
  Coordination = 'coordination',
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ButtonModule,
    CardModule,
    FloatLabelModule,
    InputTextModule,
    PasswordModule,
    ReactiveFormsModule,
    ToastModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.less',
  providers: [MessageService],
})
export class HomeComponent implements OnInit {
  formControl!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private fireAuthService: FireAuthService,
    private messageService: MessageService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  /**
   * Inicializa o formulário com os campos e validadores necessários.
   */
  private initializeForm(): void {
    this.formControl = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  /**
   * Lida com a submissão do formulário de login.
   */
  onSubmit(): void {
    if (this.formControl.valid) {
      const email = this.formControl.get('email')?.value;
      const password = this.formControl.get('password')?.value;

      const login: Login = { email, password };

      this.fireAuthService.signInWithEmailAndPassword(login.email, login.password)
  .then((user: UserCredential) => {
    const userDataFromDb = { role: 'Admin', name: '' }; // Simulação do Firestore

    console.log('Role retornada do Firestore:', userDataFromDb.role);

    const userData = {
      uid: user.user?.uid || null,
      email: user.user?.email || null,
      displayName: userDataFromDb.name,
      role: userDataFromDb.role || 'user', // Role padrão
    };

    // Validação para não sobrescrever admin
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (currentUser.role === 'admin' && userData.role !== 'admin') {
      console.warn('Tentativa de sobrescrever role de admin bloqueada!');
      return;
    }

    localStorage.setItem('user', JSON.stringify(userData));
    console.log('Dados atualizados no localStorage:', userData);


          this.messageService.add({
            severity: 'success',
            summary: 'Bem-vindo',
            detail: `Login realizado com sucesso!`,
          });

          this.router.navigate(['/painel']);
        })
        .catch((error) => {
          console.error('Erro ao fazer login:', error);

          // Tratar erros específicos de autenticação
          let errorMessage = 'Erro ao fazer login. Tente novamente mais tarde.';
          if (error.code === 'auth/user-not-found') {
            errorMessage = 'Usuário não encontrado. Verifique suas credenciais.';
          } else if (error.code === 'auth/wrong-password') {
            errorMessage = 'Senha incorreta. Por favor, tente novamente.';
          }

          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: errorMessage,
          });
        });
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Ops!',
        detail: 'Você precisa digitar seus dados de acesso corretamente.',
      });
    }
  }
}
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {UserCredential} from "@angular/fire/auth";

// Prime
import {ButtonModule} from 'primeng/button';
import {CardModule} from "primeng/card";
import {FloatLabelModule} from "primeng/floatlabel";
import {InputTextModule} from 'primeng/inputtext';
import {PasswordModule} from "primeng/password";
import {MessageService} from "primeng/api";
import {ToastModule} from "primeng/toast";

// Services
import {FireAuthService} from "../../services/fire-auth/fire-auth.service";
import {AuthService} from "../../services/auth/auth.service";

// Models
import {Login} from "../../models/login";
import {Router} from "@angular/router";


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
// Este componente "Home" se trata, na verdade, da página de login. A página "home" será "HomePage" mas o a url será "/home" para acesso de usuários.
export class HomeComponent implements OnInit {
  formControl!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private fireAuthService: FireAuthService,
    private messageService: MessageService,
    private authService: AuthService,
    private router: Router

  ) {
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  /**
   * Inicializa o formulário com os campos e validadores necessários.
   */
  private initializeForm(): void {
    this.formControl = this.formBuilder.group({
      email: new FormControl('', [Validators.required,  Validators.email]),
      password: new FormControl('', [Validators.required ] ),
    });
  }

  /**
   *
   */
  onSubmit(): void {
    if (this.formControl.valid) {
      const email = this.formControl.get('email')?.value;
      const password = this.formControl.get('password')?.value;

      const login: Login = {email, password};

      this.fireAuthService.signInWithEmailAndPassword(login.email, login.password)
        .then((user: UserCredential) => {
          console.log('Login bem-sucedido:', user.user.displayName);

          this.authService.saveUserData(user, user.user.displayName)

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

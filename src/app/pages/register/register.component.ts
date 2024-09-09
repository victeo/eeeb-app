import {Component, OnInit} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Router} from '@angular/router';

// Services
import {AuthService} from "../../services/auth/auth.service";

import {FirestoreService} from "../../services/fire-store/firestore.service";
import {FireAuthService} from "../../services/fire-auth/fire-auth.service";

// Models
import {User} from "../../models/user";
import {UserCredential} from "@angular/fire/auth";
import {ShortLinkModel} from "../../module_short-link/models/short-link.model";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.less'
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup | undefined;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService, // Injeção do serviço de autenticação
    private router: Router,
    private firestoreService: FirestoreService,
    private fireAuthService: FireAuthService,
  ) {
  }

  ngOnInit(): void {
    this.fireAuthService.signInWithEmailAndPassword("victor.atomo@gmail.com", "123455").then((user: UserCredential) => {
      console.log(user);
    })
      .catch((error) => {
        console.error('Error creating document:', error);
      });
    this.fireAuthService.listenToAuthStateChanges()

    const shortLink: ShortLinkModel = {
      slug:"",
      url:"",
      createdAt:"",
      qrCodeUrl:"",
      userId:""
    }

    this.firestoreService.createDocument("shortLinks/links", {
      shortLink
    }).then(() => {
      console.log('Document created successfully');
    })
      .catch((error) => {
        console.error('Error creating document:', error);
      });
    // this.registerForm = this.fb.group({
    //   name: ['', [Validators.required, Validators.minLength(3)]],
    //   email: ['', [Validators.required, Validators.email]],
    //   password: ['', [Validators.required, Validators.minLength(6)]],
    //   confirmPassword: ['', [Validators.required]],
    //   whatsapp: [''],
    //   address: this.fb.group({
    //     street: [''],
    //     city: [''],
    //     state: [''],
    //     postalCode: ['']
    //   })
    // }, { validator: this.passwordMatchValidator });
  }

  // Método personalizado para validar se as senhas coincidem
  // passwordMatchValidator(formGroup: FormGroup) {
  //   return formGroup.get('password')?.value === formGroup.get('confirmPassword')?.value
  //     ? null : { mismatch: true };
  // }
  //
  // // Método para tratar o envio do formulário
  // async onSubmit() {
  //   if (this.registerForm?.valid) {
  //     const formValues = this.registerForm?.value;
  //
  //     const newUser: User = {
  //       id: '', // O ID será atribuído pelo Firebase Authentication
  //       name: formValues.name,
  //       email: formValues.email,
  //       whatsapp: formValues.whatsapp,
  //       address: {
  //         street: formValues.address.street,
  //         city: formValues.address.city,
  //         state: formValues.address.state,
  //         postalCode: formValues.address.postalCode
  //       }
  //     };
  //
  //     try {
  //       // Chamando o método de registro do AuthService
  //       await this.authService.register(formValues.email, formValues.password, newUser);
  //       console.log('Usuário registrado com sucesso');
  //     } catch (error) {
  //       console.error('Erro durante o registro:', error);
  //     }
  //   } else {
  //     console.log('Formulário inválido');
  //   }
  // }
}

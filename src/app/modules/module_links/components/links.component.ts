import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

import { LinksService } from '../services/links.service';
import { Links } from '../models/links.model';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  standalone: true,
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.less'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule
  ]
})
export class LinksComponent implements OnInit {

  links: Links[] = [];
  linkForm: FormGroup;
  secondStep: boolean = false;

  constructor(
    private linksService: LinksService,
    private fb: FormBuilder
  ) {
    // Inicializa o FormGroup com o FormArray de botões
    this.linkForm = this.fb.group({
      title: ['', Validators.required],
      url_slug: ['', Validators.required],
      buttons: this.fb.array([]) // Certifica-se de inicializar corretamente o FormArray
    });
  }
  // Método para adicionar informações ao array de Links
  addInfo(): void {
    const title = this.linkForm.get('title');
    const urlSlug = this.linkForm.get('url_slug');
  
    if (title?.valid && urlSlug?.valid) {
      const newLink: Links = {
        title: title.value,
        url_slug: urlSlug.value,
        buttons: []
      };
      this.links.push(newLink);
  
      console.log('URL Slug:', urlSlug.value);
      console.log('Title:', title.value);
      console.log('Array de Links:', this.links);
  
      // Adiciona um campo para o primeiro botão automaticamente
      this.addButton();
  
      // Libera a segunda etapa para preencher os botões
      this.secondStep = true;
    } else {
      console.error('Preencha os campos');
    }
  }
  

  carregarLinks() {
    // Implementação do método para carregar links (você pode adicionar isso mais tarde)
  }

  // Getter para acessar o FormArray de botões
  get buttonsArray(): FormArray {
    return this.linkForm.get('buttons') as FormArray;
  }

  // Método para adicionar um novo botão ao FormArray
  // Método para adicionar um novo botão ao FormArray
addButton() {
  // Verifica se o último botão é inválido antes de adicionar um novo
  if (this.buttonsArray.length > 0) {
    const lastButton = this.buttonsArray.at(this.buttonsArray.length - 1);
    if (lastButton && !lastButton.valid) {
      console.error("Preencha o botão anterior antes de adicionar um novo.");
      return; // Impede a adição de um novo botão
    }
  }

  // Cria um novo grupo de controle para o botão
  const buttonGroup = this.fb.group({
    titulo: ['', Validators.required],
    url: ['', Validators.required]
  });

  // Adiciona o novo botão ao FormArray apenas se o último botão estiver preenchido
  this.buttonsArray.push(buttonGroup);
  console.log("Array de botões após adicionar:", this.buttonsArray.value);
}

// Método para criar o formulário inicial
ngOnInit() {
  // Não inicializa o FormArray com um valor vazio
  this.carregarLinks();
}

  
  
  
  // Método para criar um novo linktree
  // Método para criar um novo linktree
onCreate() {
  // Filtra os botões para remover os que estão vazios
  const validButtons = this.buttonsArray.value.filter((button: any) => {
    return button.titulo.trim() !== '' && button.url.trim() !== '';
  });

  if (validButtons.length === 0) {
    console.error('Não é possível criar uma página sem botões válidos.');
    return;
  }

  const linktreeData: Links = {
    title: this.linkForm.get('title')?.value,
    url_slug: this.linkForm.get('url_slug')?.value,
    buttons: validButtons // Apenas botões válidos
  };

  this.linksService.adicionarLink(linktreeData)
    .then((docId) => {
      console.log('Linktree criada com sucesso, ID:', docId);
      this.linkForm.reset();
      this.buttonsArray.clear(); // Limpa o FormArray após a criação
    })
    .catch((error) => {
      console.error('Erro ao criar o linktree:', error);
    });
}

  
  // Método para remover um link
  removerLink(id: string) {
  }

  // Método para atualizar um link
  atualizarLink(id: string, updatedLink: Links) {
  }
}

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

  constructor(
    private linksService: LinksService,
    private fb: FormBuilder
  ) {
    this.linkForm = this.fb.group({
      title: ['', Validators.required],
      url_slug: ['', Validators.required],
      buttons: this.fb.array([])
    });
  }

  ngOnInit() {
    this.carregarLinks();
  }

  carregarLinks() {
    this.linksService.listarLinks().subscribe((links: Links[]) => {
      this.links = links;
      console.log('Links carregados:', this.links);
    });
  }

  // Getter para acessar o FormArray de botões
  get buttonsArray(): FormArray {
    return this.linkForm.get('buttons') as FormArray;
  }

  // Método para adicionar um novo botão ao FormArray
  addButton() {
    this.buttonsArray.push(
      this.fb.group({
        titulo: ['', Validators.required],
        url: ['', Validators.required]
      })
    );
  }

  // Método para criar um novo linktree
  onCreate() {
    if (this.linkForm.valid) {
      const formValue = this.linkForm.value;
      const linktreeData: Links = {
        title: formValue.title,
        url_slug: formValue.url_slug,
        buttons: this.buttonsArray.value
      };
  
      this.linksService.adicionarLink(linktreeData)
        .then(() => {
          console.log('Linktree criada com sucesso:', linktreeData);
          this.linkForm.reset();
          this.buttonsArray.clear();
          this.carregarLinks(); // Recarregar a lista de links
        })
        .catch(error => {
          console.error('Erro ao criar o linktree:', error);
        });
    }
  }

  // Método para remover um link
  removerLink(id: string) {
    this.linksService.removerLink(id)
      .then(() => {
        console.log('Link removido com sucesso!');
        this.links = this.links.filter(link => link.id !== id);
      })
      .catch(error => {
        console.error('Erro ao remover o link:', error);
      });
  }

  // Método para atualizar um link
  atualizarLink(id: string, updatedLink: Links) {
    this.linksService.atualizarLink(id, updatedLink)
      .then(() => {
        console.log('Link atualizado com sucesso!');
        this.carregarLinks(); // Recarregar a lista de links
      })
      .catch(error => {
        console.error('Erro ao atualizar o link:', error);
      });
  }
}

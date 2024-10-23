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
    this.linkForm = this.fb.group({
      title: ['', Validators.required],
      url_slug: ['', Validators.required],
      buttons: this.fb.array([])
    });
  }

  ngOnInit() {
    this.carregarLinks();
  }

  addInfo(): void{
    const title = this.linkForm.get('title')
    const urlSlug = this.linkForm.get('url_slug')

    if(title?.valid && urlSlug?.valid){
      console.log(urlSlug.value);
      console.log(title.value);

      urlSlug.disable()
      title.disable()
    }else{
      console.error('Preencha os campos')
    }

  }

  carregarLinks() {

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

  }

  // Método para remover um link
  removerLink(id: string) {

  }

  // Método para atualizar um link
  atualizarLink(id: string, updatedLink: Links) {

  }
}

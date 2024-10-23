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


  links: Links[] = []

  linkForm: FormGroup = new FormGroup({}); // Inicializando o FormGroup vazio

  id_negoco: number = 0

  constructor(
    private linksService: LinksService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    // Carrega os links do Firebase
    // this.linksService.listarLinks().subscribe((links: Links[]) => {
    //   this.links = links;
    //   console.log('Links carregados:', this.links);
    // });
    this.initForm()
  }
  /**
   * 
   */
  private initForm(): void {
    this.linkForm = this.fb.group({
      title: ['', Validators.required],
      url_slug: ['', Validators.required],
      buttons: this.fb.array([]) // Inicializa o FormArray vazio
    });

  }
  get buttonsArray(): FormArray {
    return this.linkForm.get('buttons') as FormArray;
  }

  onCreate() {
  }
  // Método para adicionar um novo botão ao FormArray
  addButton() {
    const buttonsArray = this.linkForm.get('buttons') as FormArray;
    buttonsArray.push(
      this.fb.group({
        titulo: ['', Validators.required],
        url: ['', Validators.required]
      })
    );
  }

  /**
   * Método para remover um link
   * @param id 
   */
  removerLink(id: string) {
    // this.linksService.removerLink(id).then(() => {
    //   this.links = this.links.filter(link => link.id !== id);
    // }).catch(error => {
    //   console.error('Erro ao remover o link:', error);
    // });
  }

  // Método para atualizar um link
  atualizarLink(id: string, links: Links) {
    // this.linksService.atualizarLink(id, links).then(() => {
    //   console.log('Link atualizado com sucesso!');
    // }).catch(error => {
    //   console.error('Erro ao atualizar o link:', error);
    // });
  }
}

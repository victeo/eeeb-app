import { Component, OnInit } from '@angular/core';
import { LinksService } from '../services/links.service';
import { Links } from '../models/links.model';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';


@Component({
  standalone: true,
  selector: 'app-links',
  templateUrl: './links.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule
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
      titulo: ['', Validators.required], 
      url: ['', Validators.required], 
      descricao: ['', Validators.required], 
    });
  }

  onSubmit() {

    if (this.linkForm.valid) {

      

      this.links.push(this.linkForm.value)
      console.log(this.links);

      this.id_negoco ++

      // Aqui você pode enviar os dados ou fazer o que for necessário com eles
    } else {
      console.error('Formulário inválido');
    }
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

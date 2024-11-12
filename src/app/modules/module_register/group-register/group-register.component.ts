import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { RegisterService } from '../services/register.service/register.service';
import { User as UserInfo } from 'app/models/user';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-group-register',
  standalone: true,
  imports: [CommonModule, FileUploadModule, ButtonModule, TableModule, FormsModule, ToastModule],
  templateUrl: './group-register.component.html',
  styleUrls: ['./group-register.component.less'],
  providers: [MessageService]
})
export class GroupRegisterComponent {
  fileData: any[] = [];
  tableColumns: string[] = [];
  cadastroTipo: 'aluno' | 'responsavel' = 'aluno'; // Tipo de cadastro: aluno ou responsável

  constructor(
    private registerService: RegisterService,
    private messageService: MessageService
  ) {}

  onFileSelected(event: any): void {
    const file = event.files[0];
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      // Converte a planilha diretamente em JSON com cabeçalhos
      const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // Extraímos a primeira linha como cabeçalhos e as demais como dados
      this.tableColumns = jsonData[0] as string[]; // Define os cabeçalhos da tabela
      this.fileData = jsonData.slice(1).map((row: any[]) => {
        // Cria um objeto onde as chaves são os cabeçalhos
        const rowData: { [key: string]: any } = {};
        row.forEach((cell, index) => {
          rowData[this.tableColumns[index]] = cell;
        });
        return rowData;
      });
    };

    reader.readAsArrayBuffer(file);
  }

  async uploadFile(): Promise<void> {
    if (this.fileData.length > 0) {
      try {
        for (const entryData of this.fileData) {
          if (entryData['Email']) {
            const userInfo: UserInfo = { ...entryData };

            // Condicional para selecionar o tipo de cadastro
            if (this.cadastroTipo === 'aluno') {
              await this.registerService.registerUser(entryData['Email'], 'senhaPadrao', userInfo);
            } else if (this.cadastroTipo === 'responsavel') {
              await this.registerService.registerResponsavel(entryData['Email'], 'senhaPadrao', userInfo);
            }
          } else {
            console.warn('Registro ignorado: Email vazio.');
          }
        }
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: `${this.cadastroTipo === 'aluno' ? 'Alunos' : 'Responsáveis'} cadastrados com sucesso!` });
      } catch (error) {
        console.error('Erro ao enviar dados para o Firebase:', error);
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: `Ocorreu um erro ao cadastrar os ${this.cadastroTipo === 'aluno' ? 'alunos' : 'responsáveis'}.` });
      }
    } else {
      console.log('Por favor, selecione um arquivo primeiro.');
    }
  }
}

import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-group-register',
  standalone: true,
  imports: [CommonModule, FileUploadModule, ButtonModule, TableModule],
  templateUrl: './group-register.component.html',
  styleUrls: ['./group-register.component.less']
})
export class GroupRegisterComponent {
  fileData: any[] = [];
  tableColumns: string[] = [];

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

  uploadFile(): void {
    if (this.fileData.length > 0) {
      console.log('Arquivo pronto para envio:', this.fileData);
    } else {
      console.log('Por favor, selecione um arquivo primeiro.');
    }
  }
}

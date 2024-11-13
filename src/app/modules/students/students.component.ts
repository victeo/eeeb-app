import { Component, OnInit } from '@angular/core';
import { FirestoreService } from 'app/services/fire-store/firestore.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.less']
})
export class StudentsComponent implements OnInit {
  students: any[] = [];

  constructor(private firestoreService: FirestoreService) {}

  ngOnInit() {
    this.loadStudents();
  }

  async loadStudents() {
    try {
      this.students = await this.firestoreService.searchCollection('students');
      console.log('Alunos carregados:', this.students);
    } catch (error) {
      console.error('Erro ao carregar alunos:', error);
    }
  }  
}

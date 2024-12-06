import { Component } from '@angular/core';
import { SidebarComponent } from 'app/admin/painel/sidebar/sidebar.component';
import { TopbarComponent } from 'app/admin/painel/topbar/topbar.component';
import { Auth } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [SidebarComponent, TopbarComponent, CommonModule],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.less'],
})
export class HomepageComponent {
  userName: string = 'Responsável'; // Nome do usuário logado

  constructor(private auth: Auth) {}

  ngOnInit(): void {
    const user = this.auth.currentUser;
    console.log('Usuário autenticado:', user);
  }
}

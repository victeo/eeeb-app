import { Component } from '@angular/core';
import { SidebarComponent } from 'app/admin/painel/sidebar/sidebar.component';
import { TopbarComponent } from 'app/admin/painel/topbar/topbar.component';
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
}

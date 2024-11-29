import { AuthService } from './../../../services/auth/auth.service';
import {Component, OnInit} from '@angular/core';
import {MenuItem, MessageService} from "primeng/api";
import {Router} from "@angular/router";
import {ToolbarModule} from "primeng/toolbar";
import {Button} from "primeng/button";
import {SplitButtonModule} from "primeng/splitbutton";
import { CommonModule } from '@angular/common';
import {LayoutState} from "../../../models/layout-state";
import {LayoutService} from "../../../services/Layout/layout.service";
import { FireAuthService } from 'app/services/fire-auth/fire-auth.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [
    ToolbarModule,
    Button,
    SplitButtonModule
  ],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.less',
  providers: [MessageService]

})
export class TopbarComponent implements OnInit {
  items: MenuItem[] | undefined;
  userName: string | null = '';

  constructor(
    private router: Router,
    private messageService: MessageService,
    private layoutService: LayoutService,
    private fireAuthService: FireAuthService,
    private authService : AuthService
  ) {
  }

  ngOnInit() {
  
    const name = this.fireAuthService.getUserName();
    this.userName = name || 'Usuário';
    
    const user = this.authService.getUserData();
  if (user?.displayName) {
    this.userName = user.displayName.split(' ')[0]; // Exibe apenas o primeiro nome
  } else {
    this.userName = 'Usuário'; // Valor padrão
  }

    this.items = [
      {
        label: 'Sair',
        command: () => {
          this.logout();
        }
      },
      //adicionar mais opções aqui
    ];
  }

  toggleClass() {
    this.layoutService.toggleClassState();
  }

  logout() {
    this.fireAuthService.signOut();
    this.router.navigate(['/']); // Redireciona para a página inicial ou login
  }

}

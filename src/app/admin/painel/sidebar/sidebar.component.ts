import {Component, ElementRef, OnInit} from '@angular/core';
import {LayoutService} from "../../../services/Layout/layout.service";
import {PanelMenuModule} from "primeng/panelmenu";
import {MenuItem} from "primeng/api";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    PanelMenuModule,
    NgClass

  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.less'
})
export class SidebarComponent implements OnInit {

  items: MenuItem[] | undefined;
  isActive: string = 'opened';

  constructor(
    private layoutService: LayoutService,
  ) {
  }

  ngOnInit(): void {
    this.layoutService.classState$.subscribe((state) => {
      this.isActive = state ? 'opened' : 'closed';
    });
    this.items = [
      {
        label: 'Serviços',
        icon: 'pi pi-desktop',
        items: [
          {
            label: 'Encurtador',
            icon: 'pi pi-mobile',
            routerLink: ['/painel/criar-links'],
          },
          {
            label: 'Alunos',
            icon: 'pi pi-book',
            routerLink: ['/painel/alunos']
          },
          {
            label: 'Responsáveis',
            icon: 'pi pi-address-book',
            routerLink: ['/painel/responsaveis']
          },
          {
            label: 'Cadastro',
            icon: 'pi-cloud-upload',
            items: [

              {
                label: 'Cadastro de estudantes',
                icon: 'pi pi-user',
                routerLink:['/painel/register']
              },
              {
                label: 'Cadastro em Lotes',
                icon: 'pi pi-users',
                routerLink: ['/painel/groupRegister']
              },
              {
                label: 'Cadastro de responsáveis',
                icon: 'pi-face-smile',
                routerLink: ['/painel/parentRegister']
              }
            ]
          }
        ]
      }
    ]
  }

}
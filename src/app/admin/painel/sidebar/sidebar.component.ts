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
        label: 'Files',
        icon: 'pi pi-file',
        items: [
          {
            label: 'Documents',
            icon: 'pi pi-file',
            items: [
              {
                label: 'Invoices',
                icon: 'pi pi-file-pdf',
                items: [
                  {
                    label: 'Pending',
                    icon: 'pi pi-stop'
                  },
                  {
                    label: 'Paid',
                    icon: 'pi pi-check-circle'
                  }
                ]
              },
              {
                label: 'Clients',
                icon: 'pi pi-users'
              }
            ]
          },
          {
            label: 'Images',
            icon: 'pi pi-image',
            items: [
              {
                label: 'Logos',
                icon: 'pi pi-image'
              }
            ]
          }
        ]
      },
      {
        label: 'Cloud',
        icon: 'pi pi-cloud',
        items: [
          {
            label: 'Upload',
            icon: 'pi pi-cloud-upload'
          },
          {
            label: 'Download',
            icon: 'pi pi-cloud-download'
          },
          {
            label: 'Sync',
            icon: 'pi pi-refresh'
          }
        ]
      },
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
            label: 'Links',
            icon: 'pi pi-sitemap',
            routerLink: ['/painel/links']
          },
          {
            label: 'Desktop',
            icon: 'pi pi-desktop'
          },
          {
            label: 'Tablet',
            icon: 'pi pi-tablet'
          }
        ]
      }
    ]
    console.log(this.items);
  }
  

}

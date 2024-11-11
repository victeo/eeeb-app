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
    private fireAuthService: FireAuthService
  ) {
  }

  ngOnInit() {
   
    this.userName = this.fireAuthService.getUserName();

    this.items = [
      {
        label: 'Update',
        command: () => {
          this.update();
        }
      },
      {
        label: 'Delete',
        command: () => {
          this.delete();
        }
      },
      {label: 'Angular Website', url: 'http://angular.io'},
      {separator: true},
      {label: 'Upload', routerLink: ['/fileupload']}
    ];
  }

  toggleClass() {
    this.layoutService.toggleClassState();
  }

  save(severity: string) {
    this.messageService.add({severity: severity, summary: 'Success', detail: 'Data Saved'});
  }

  update() {
    this.messageService.add({severity: 'success', summary: 'Success', detail: 'Data Updated'});
  }

  delete() {
    this.messageService.add({severity: 'success', summary: 'Success', detail: 'Data Deleted'});
  }
}

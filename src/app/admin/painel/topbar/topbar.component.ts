import {Component, OnInit} from '@angular/core';
import {MenuItem, MessageService} from "primeng/api";
import {Router} from "@angular/router";
import {ToolbarModule} from "primeng/toolbar";
import {Button} from "primeng/button";
import {SplitButtonModule} from "primeng/splitbutton";
import {LayoutState} from "../../../models/layout-state";
import {LayoutService} from "../../../services/Layout/layout.service";

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

  constructor(
    private router: Router,
    private messageService: MessageService,
    private layoutService: LayoutService,
  ) {
  }

  ngOnInit() {

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

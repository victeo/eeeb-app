import {Component, OnDestroy, Renderer2, ViewChild} from '@angular/core';
import {NavigationEnd, Router, RouterOutlet} from "@angular/router";
import {NgClass} from "@angular/common";
import {filter, Subscription} from 'rxjs';

import {TopbarComponent} from "./topbar/topbar.component";
import {SidebarComponent} from "./sidebar/sidebar.component";
import {FooterComponent} from "./footer/footer.component";
import {ConfigComponent} from "./config/config.component";

// Services
import {LayoutService} from "../../services/Layout/layout.service";

@Component({
  selector: 'app-painel',
  standalone: true,
  imports: [
    RouterOutlet,
    NgClass,
    TopbarComponent,
    SidebarComponent,
    FooterComponent,
    ConfigComponent
  ],
  templateUrl: './painel.component.html',
  styleUrl: './painel.component.less'
})
export class PainelComponent {

}

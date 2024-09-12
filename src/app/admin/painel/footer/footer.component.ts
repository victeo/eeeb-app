import { Component } from '@angular/core';
import {LayoutService} from "../../../services/Layout/layout.service";

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.less'
})
export class FooterComponent {
  constructor(public layoutService: LayoutService) { }
}

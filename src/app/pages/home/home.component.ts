import { Component } from '@angular/core';
import {CheckboxModule} from "primeng/checkbox";
import { ButtonModule } from 'primeng/button';
import {CardModule} from "primeng/card";
import {FloatLabelModule} from "primeng/floatlabel";
import { InputTextModule } from 'primeng/inputtext';
import {PasswordModule} from "primeng/password";


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CheckboxModule,
    ButtonModule,
    CardModule,
    FloatLabelModule,
    InputTextModule,
    PasswordModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.less'
})
export class HomeComponent {

}

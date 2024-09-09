import { Component } from '@angular/core';
import {ShortLinkFormComponent} from "./short-link-form/short-link-form.component";

@Component({
  selector: 'app-short-link',
  template: `
    <app-short-link-form></app-short-link-form>
  `,
  standalone: true,
  imports: [
    ShortLinkFormComponent
  ],
  styles: []
})
export class ShortLinkComponent {}

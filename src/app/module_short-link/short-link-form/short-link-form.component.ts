import {Component} from '@angular/core';
import {ShortLinkService} from '../short-link.service';
import {ShortLinkModel} from '../models/short-link.model';
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-short-link-form',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './short-link-form.component.html',
  styleUrl: './short-link-form.component.less'
})
export class ShortLinkFormComponent {
  url: string = '';
  slug: string = '';
  qrCodeUrl: string = '';

  constructor(private shortLinkService: ShortLinkService) {
  }

  createShortLink() {
    const data: ShortLinkModel = {
      url: this.url,
      slug: this.slug,
      userId: 'userIdExample',
      createdAt: new Date(),
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?data=${this.url}&size=150x150`
    };

    this.shortLinkService.createShortLink(data, this.slug).then(() => {
      this.qrCodeUrl = data.qrCodeUrl;
    });
  }
}

import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ShortLinkService} from '../short-link.service';
import {ShortLinkModel} from "../models/short-link.model";

@Component({
  selector: 'app-redirect',
  standalone: true,
  imports: [],
  templateUrl: './redirect.component.html',
  styleUrl: './redirect.component.less'
})
export class RedirectComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private shortLinkService: ShortLinkService,
    private router: Router
  ) {}

   async ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug');

    if (slug) {
      try {
        const docSnapshot: ShortLinkModel | null = await this.shortLinkService.getShortLink(slug);
        if (docSnapshot && docSnapshot.url) {  // Verifica se docSnapshot não é null
          window.location.href = docSnapshot.url;
        } else {
          await this.router.navigate(['/']);  // Caso o slug não exista ou docSnapshot seja null
        }
      } catch (error) {
        console.error('Erro ao buscar o short link:', error);
        await this.router.navigate(['/']);  // Em caso de erro, redireciona
      }
    } else {
      await this.router.navigate(['/']);  // Se o slug for inválido
    }
  }

}

import { FireAuthService } from './../../../services/fire-auth/fire-auth.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Links } from '../models/links.model';

@Injectable({
  providedIn: 'root'
})
export class LinksService {
  private collectionPath = 'links';

  constructor(fireAuthService: FireAuthService) {} // Certifique-se de que o AngularFirestore está injetado corretamente

  //  listarLinks():  {
      
  //  }

  //  adicionarLink(links: Links):void {
  //  }

  //  atualizarLink(id: string, links: Links): {
  //  }

  //  removerLink(id: string) {
  //  }
}

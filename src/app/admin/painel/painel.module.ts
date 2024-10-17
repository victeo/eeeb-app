import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PainelComponent } from './painel.component';
import {ShortLinkComponent} from "../../module_short-link/short-link.component";
import {RegisterComponent} from "../register/register.component";
import { LinksComponent } from '../../modules/module_links/components/links.component';

const routes: Routes = [
  {
    path: '',
    component: PainelComponent,
    children: [
      { path: 'criar-links', component: ShortLinkComponent },
      { path: 'novo-usuario', component: RegisterComponent },
      { path: 'links', component: LinksComponent }
    ]
  }
];

@NgModule({
  declarations: [], // Certifique-se de que os componentes estão aqui
  imports: [RouterModule.forChild(routes), PainelComponent, ShortLinkComponent, LinksComponent],
  exports: [RouterModule]
})
export class PainelModule { }

import {Routes} from '@angular/router';
import {RegisterComponent} from "./pages/register/register.component";

// Módulo pra redirecionar usando um slug (encurtador de links)
import {RedirectComponent} from "./module_short-link/redirect/redirect.component";
import {ShortLinkComponent} from "./module_short-link/short-link.component";

export const routes: Routes = [
  {
    path: 'registro',
    component: RegisterComponent
  },
  {path: 'criar-links', component: ShortLinkComponent},
  {path: ':slug', component: RedirectComponent},

];

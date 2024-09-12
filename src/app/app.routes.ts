import {Routes} from '@angular/router';
import {RegisterComponent} from "./pages/register/register.component";

// Módulo pra redirecionar usando um slug (encurtador de links)
import {RedirectComponent} from "./module_short-link/redirect/redirect.component";
import {ShortLinkComponent} from "./module_short-link/short-link.component";

// Componentes
import {HomeComponent} from "./pages/home/home.component";
import {PainelComponent} from "./admin/painel/painel.component";

// Services
import {UserGuard} from "./services/guards/user.guard";

export const routes: Routes = [
  {
    path: "",
    component: HomeComponent
  },
  {
    path: "painel",
    component: PainelComponent,
    canActivate: [UserGuard],
    children: [
      {path: 'criar-links', component: ShortLinkComponent},

    ]
  },
  {
    path: 'registro',
    component: RegisterComponent
  },
  {path: ':slug', component: RedirectComponent},

];

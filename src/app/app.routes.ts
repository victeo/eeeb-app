import {Routes} from '@angular/router';
import {RegisterComponent} from "./pages/register/register.component";
import {GroupRegisterComponent} from './modules/module_register/group-register/group-register.component';

// Módulo pra redirecionar usando um slug (encurtador de links)
import {RedirectComponent} from "./module_short-link/redirect/redirect.component";
import {ShortLinkComponent} from "./module_short-link/short-link.component";

// Componentes
import {HomeComponent} from "./pages/home/home.component";
import {PainelComponent} from "./admin/painel/painel.component";
import { ParentingComponent } from './modules/module_register/parenting/parenting.component';

// Services
import {UserGuard} from "./services/guards/user.guard";
import { ParentRegisterComponent } from './modules/module_register/parent-register/parent-register.component';

export const routes: Routes = [
  {
    path: "",
    component: HomeComponent
  },
  {
    path: "painel",
    loadChildren: () => import('./admin/painel/painel.module').then(m => m.PainelModule),
    canActivate: [UserGuard]
  },
  {
    path: 'painel/register',
    component: RegisterComponent
  },
  {
    path: 'painel/parentRegister',
    component: ParentRegisterComponent
  },
  {
    path: 'painel/parenting',
    component: ParentingComponent
  },
  {
    path: 'painel/groupRegister',
    component: GroupRegisterComponent
  },
  {path: ':slug', component: RedirectComponent},
  // {path: '**', redirectTo: ''} // Redireciona rotas inválidas para a página principal


];

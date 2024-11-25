import { Routes } from '@angular/router';
import { RegisterComponent } from "./pages/register/register.component";
import { GroupRegisterComponent } from './modules/module_register/group-register/group-register.component';

// Módulo para redirecionar usando um slug (encurtador de links)
import { RedirectComponent } from "./module_short-link/redirect/redirect.component";
import { ShortLinkComponent } from "./module_short-link/short-link.component";

// Componentes
import { HomeComponent } from "./pages/home/home.component";
import { PainelComponent } from "./admin/painel/painel.component";
import { ParentingComponent } from './modules/module_register/parenting/parenting.component';

// Services
import { UserGuard } from "./services/guards/user.guard";
import { AdminGuard } from "./services/guards/admin.guard";
import { ParentRegisterComponent } from './modules/module_register/parent-register/parent-register.component';
import { ParentsComponent } from './modules/parents/parents.component';
import { StudentsComponent } from './modules/students/students.component';

export const routes: Routes = [
  {
    path: "",
    component: HomeComponent
  },
  {
    path: "painel",
    loadChildren: () => import('./admin/painel/painel.module').then(m => m.PainelModule),
    canActivate: [UserGuard] // Protege com UserGuard para todos os usuários autenticados
  },
  {
    path: 'painel/register',
    component: RegisterComponent,
    canActivate: [AdminGuard] // Apenas admins podem acessar o cadastro principal
  },
  {
    path: 'painel/parentRegister',
    component: ParentRegisterComponent,
    canActivate: [AdminGuard] // Apenas admins podem registrar responsáveis
  },
  {
    path: 'painel/responsaveis',
    component: ParentsComponent,
    canActivate: [AdminGuard] // Usuários autenticados podem visualizar responsáveis
  },
  {
    path: 'painel/alunos',
    component: StudentsComponent,
    canActivate: [AdminGuard] // Usuários autenticados podem visualizar alunos
  },
  {
    path: 'painel/parenting',
    component: ParentingComponent,
    canActivate: [AdminGuard] // Usuários autenticados podem acessar esta funcionalidade
  },
  {
    path: 'painel/groupRegister',
    component: GroupRegisterComponent,
    canActivate: [AdminGuard] // Apenas admins podem registrar grupos
  },
  {
    path: ':slug',
    component: RedirectComponent
  },
  {
    path: '**',
    redirectTo: '' // Redireciona rotas inválidas para a página principal
  }
];

import { RegisterComponent } from './../../pages/register/register.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PainelComponent } from './painel.component';
import { ShortLinkComponent} from "../../module_short-link/short-link.component";
import { RegisterComponent as signUp} from "../../modules/module_register/components/register/register.component"
import { GroupRegisterComponent } from 'app/modules/module_register/group-register/group-register.component';
import { ParentRegisterComponent } from 'app/modules/module_register/parent-register/parent-register.component';
import { ParentingComponent } from 'app/modules/module_register/parenting/parenting.component';
import { StudentsComponent } from 'app/modules/students/students.component';
import { ParentsComponent } from 'app/modules/parents/parents.component';
import { HomepageComponent } from 'app/pages/homepage/homepage.component';

const routes: Routes = [
  {
    path: '',
    component: PainelComponent,
    children: [
      { path: 'criar-links', component: ShortLinkComponent },
      { path: 'novo-usuario', component: RegisterComponent },
      { path: 'register', component: signUp},
      { path: 'groupRegister', component: GroupRegisterComponent},
      { path: 'parentRegister', component: ParentRegisterComponent},
      { path: 'parenting', component: ParentingComponent},
      { path: 'alunos', component: StudentsComponent},
      { path: 'responsaveis', component: ParentsComponent}
    ]
  },
  {
    path: "home",
    component: HomepageComponent,
    children:[
      //adicionar funcionalidades para usuário
    ]
  }
];

@NgModule({
  declarations: [], // Certifique-se de que os componentes estão aqui
  imports: [RouterModule.forChild(routes), PainelComponent, ShortLinkComponent],
  exports: [RouterModule]
})
export class PainelModule { }
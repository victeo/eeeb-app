import { RegisterComponent } from './../../pages/register/register.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PainelComponent } from './painel.component';
import { ShortLinkComponent} from "../../module_short-link/short-link.component";
import { RegisterComponent as signUp} from "../../modules/module_register/components/register/register.component"

const routes: Routes = [
  {
    path: '',
    component: PainelComponent,
    children: [
      { path: 'criar-links', component: ShortLinkComponent },
      { path: 'novo-usuario', component: RegisterComponent },
      { path: 'register', component: signUp}
    ]
  }
];

@NgModule({
  declarations: [], // Certifique-se de que os componentes estão aqui
  imports: [RouterModule.forChild(routes), PainelComponent, ShortLinkComponent],
  exports: [RouterModule]
})
export class PainelModule { }

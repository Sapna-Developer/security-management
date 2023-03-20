import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGaurdGuard } from './services/auth-gaurd.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {path:'',redirectTo:'admin',pathMatch:'full'},
  {path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

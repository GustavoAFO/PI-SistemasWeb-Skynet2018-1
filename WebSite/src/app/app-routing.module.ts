import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  // { path: 'detail/:id', component: HeroDetailComponent },
  { path: 'home', component: HomeComponent, canActivate : [AuthGuardService] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [
    RouterModule
  ],
  declarations: []
})


export class AppRoutingModule {
}



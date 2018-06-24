import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthGuardService } from './services/auth-guard.service';

import { GraficosComponent } from './graficos/graficos.component';

import { GerenciaNodesComponent } from './gerencia-nodes/gerencia-nodes.component';

import { GraficoSensoresComponent } from './grafico-sensores/grafico-sensores.component';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  // { path: 'detail/:id', component: HeroDetailComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuardService] },
  { path: 'graficos', component: GraficosComponent, canActivate: [AuthGuardService] },
  { path: 'nodes', component: GerenciaNodesComponent, canActivate: [AuthGuardService] },
  { path: 'grafico-sensores', component: GraficoSensoresComponent, canActivate: [AuthGuardService] }
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



import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OPERATOR } from './shared/constants/Config';
import { AuthGuardService } from './shared/guards/auth-guard/auth-guard.service';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'login/' + OPERATOR.OPERATOR_ID,
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'login/:id',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy', useHash: true }),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

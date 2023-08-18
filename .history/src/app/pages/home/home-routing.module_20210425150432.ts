import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { HomePage } from './home.page'

const routes: Routes = [
  { path: '', redirectTo: 'user-identification', pathMatch: 'full' },
  {
    path: '',
    component: HomePage,
    children: [
      { path: 'home', loadChildren: () => import('../home/home.module').then(m => m.HomePageModule) },
      { path: 'user-identification', loadChildren: () => import('../user-identification/user-identification.module').then(m => m.UserIdentificationPageModule) },
      { path: 'card-creation', loadChildren: () => import('../card-creation/card-creation.module').then(m => m.CardCreationPageModule) },
      { path: 'settings', loadChildren: () => import('../settings/settings.module').then(m => m.SettingsPageModule) }
    ]
  }



]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule { }

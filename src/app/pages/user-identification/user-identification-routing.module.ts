import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { UserIdentificationPage } from './user-identification.page'

const routes: Routes = [
  {
    path: '',
    component: UserIdentificationPage
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserIdentificationPageRoutingModule {}

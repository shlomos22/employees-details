import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CardCreationPage } from './card-creation.page';

const routes: Routes = [
  {
    path: '',
    component: CardCreationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CardCreationPageRoutingModule {}

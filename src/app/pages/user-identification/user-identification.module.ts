import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

import { IonicModule } from '@ionic/angular'

import { UserIdentificationPageRoutingModule } from './user-identification-routing.module'

import { UserIdentificationPage } from './user-identification.page'
import { TranslateModule } from '@ngx-translate/core'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserIdentificationPageRoutingModule,
    TranslateModule
  ],
  declarations: [UserIdentificationPage]
})
export class UserIdentificationPageModule {}

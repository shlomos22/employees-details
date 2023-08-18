import { Component } from '@angular/core'
import { PopoverController } from '@ionic/angular'
import { PopoverComponent } from './components/popover/popover.component'
import { StoreService } from '../../shared/services/store/store.service';




@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  croppedImage: any = ''
  userName: any = ''

  constructor(
    public popoverController: PopoverController,
    private storeService: StoreService
  ) {
    this.userName = this.getUserName()
  }

  public async presentPopover(): Promise<void> {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      cssClass: 'popover-class',
      translucent: true
    })
    await popover.present()
  }

  private async getUserName(): Promise<string> {
    const firstName =  await this.storeService.get('firstName')
    const lastName = await this.storeService.get('lastName')

    return this.userName = firstName + ' ' + lastName
  }



}

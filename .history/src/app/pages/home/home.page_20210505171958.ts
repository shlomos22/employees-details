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
  userName: string = ''

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

  private getUserName(): string {
    const firstName = this.storeService.get('firstName')
    const lastName = this.storeService.get('lastName')

    return this.userName = firstName + ' ' + lastName
  }



}

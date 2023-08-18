import { Component } from '@angular/core'
import { Platform, PopoverController } from '@ionic/angular'
import { ImageCroppedEvent } from 'ngx-image-cropper'
import { ReaderService } from '../../shared/services/reader/reader.service'
import { MyElectronService } from '../../shared/services/electron/my-electron.service'
import { PopoverComponent } from './components/popover/popover.component'




@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  croppedImage: any = ''
  userName: string = ''

  constructor(
    public popoverController: PopoverController
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
    const firstName = localStorage.getItem('firstName')
    const lastName = localStorage.getItem('lastName')

    return this.userName = firstName + ' ' + lastName
  }



}

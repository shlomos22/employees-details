import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(public modalController: ModalController) { }

  public async presentModal(modalPage: any, message?: string) {

    const modal = await this.modalController.create({
      component: modalPage,
      cssClass: 'standard-modal',
      componentProps: {
        'message': message,
      },
      backdropDismiss: false
    });
    return await modal.present();
  }

  public dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}

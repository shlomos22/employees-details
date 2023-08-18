import { Injectable } from '@angular/core'
import { ToastController } from '@ionic/angular'

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toast: HTMLIonToastElement

  constructor(private toastController: ToastController) {
    // hack of toast
    this.toastController.create({ animated: false }).then(t => { t.present(); t.dismiss() })
  }

  public async displayToast(message: string, duration?: number, color?: string): Promise<void> {
    if (this.toast) {
      this.toast.dismiss()
      this.toast = null
    }

    this.toast = await this.toastController.create({
      message: message,
      color: color? color : "primary",
      duration: duration? duration : 3 * 1000,
      buttons: [{
        text: "X",
        handler: ()=> { this.toast.dismiss() }
      }]
    })
    await this.toast.present()
  }
}

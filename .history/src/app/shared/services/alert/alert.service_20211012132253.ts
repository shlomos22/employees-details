import { Injectable } from '@angular/core'
import { AlertController } from '@ionic/angular'
import { TranslateService } from '@ngx-translate/core'
import { LoadingService } from '../loading/loading.service'

export enum errType {
  NETWORK_STATUS_OFF,
  NETWORK_STATUS_ON,
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(
    private alertController: AlertController,
    private translateService: TranslateService,
    private loadingService: LoadingService
  ) { }



  public async displayErrorFromServer(error: any): Promise<void> {
    console.error(error)

    this.loadingService.dismissLoading()
    const alert = await this.alertController.create({
      cssClass: 'alert-class',
      header: this.translateService.instant('App.Interactions.ServerError.title'),
      message: this.translateService.instant('App.Interactions.ServerError.defaultBody'),
      buttons: [
        { text: this.translateService.instant('App.Interactions.ServerError.button'), role: 'cancel' }
      ]
    })
    await alert.present()
  }

  public async displayErrorSystemSettings(): Promise<boolean> {
    return new Promise(async (resolve) => {
      this.loadingService.dismissLoading()
      const alert = await this.alertController.create({
        cssClass: 'alert-class',
        header: this.translateService.instant('App.Interactions.SettingsError.title'),
        message: this.translateService.instant('App.Interactions.SettingsError.defaultBody'),
        buttons: [
          {
            text: this.translateService.instant('App.Interactions.SettingsError.cancelBtn'),
            role: 'cancel',
            handler: () => { return resolve(false) }
          },
          {
            text: this.translateService.instant('App.Interactions.SettingsError.acceptBtn'),
            handler: () => { return resolve(true) }
          }
        ]
      })
      await alert.present()
    })
  }

  public async displayRecoveryCardEmployee(): Promise<boolean> {
    return new Promise(async (resolve) => {
      this.loadingService.dismissLoading()
      const alert = await this.alertController.create({
        cssClass: 'alert-class',
        header: this.translateService.instant('App.Interactions.RecoveryCardEmployeeMesseges.title'),
        message: this.translateService.instant('App.Interactions.RecoveryCardEmployeeMesseges.defaultBody'),
        buttons: [
          {
            text: this.translateService.instant('App.Interactions.RecoveryCardEmployeeMesseges.cancelBtn'),
            role: 'cancel',
            handler: () => { return resolve(false) }
          },
          {
            text: this.translateService.instant('App.Interactions.RecoveryCardEmployeeMesseges.acceptBtn'),
            handler: () => { return resolve(true) }
          }
        ]
      })
      await alert.present()
    })
  }


  public async displayCreateEmployeeCard(): Promise<boolean> {
    return new Promise(async (resolve) => {
      const alert = await this.alertController.create({
        cssClass: 'alert-class',
        header: this.translateService.instant('App.Interactions.CreateEmployeeCardMesseges.title'),
        message: this.translateService.instant('App.Interactions.CreateEmployeeCardMesseges.defaultBody'),
        buttons: [
          {
            text: this.translateService.instant('App.Interactions.CreateEmployeeCardMesseges.cancelBtn'),
            role: 'cancel',
            handler: () => { return resolve(false) }
          },
          {
            text: this.translateService.instant('App.Interactions.CreateEmployeeCardMesseges.acceptBtn'),
            handler: () => { return resolve(true) }
          }
        ]
      })
      await alert.present()
    })
  }
}

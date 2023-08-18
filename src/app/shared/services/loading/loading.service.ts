import { Injectable } from '@angular/core'
import { LoadingController } from '@ionic/angular'
import { TranslateService } from '@ngx-translate/core'

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private hasCalledLoading = false
  private loadingRef: HTMLIonLoadingElement = null

  constructor(private loadingController: LoadingController, private translateService: TranslateService) { }

  public presentLoading(): void {
    if (this.hasCalledLoading) return

    this.hasCalledLoading = true
    this.loadingController.create({
      cssClass: 'loading-class',
      message: this.translateService.instant('App.Interactions.loadingPleaseWait')
    }).then(ref => {
      ref.present().then(() => this.loadingRef = ref)
    })
  }

  public dismissLoading(): void {
    if (!this.hasCalledLoading) return
    if (this.loadingRef == null) {
      setTimeout(() => this.dismissLoading(), 100)
    } else {
      this.loadingRef.dismiss()
      this.hasCalledLoading = false
      this.loadingRef = null
    }
  }
}

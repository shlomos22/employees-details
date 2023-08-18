import { Component, OnInit } from '@angular/core';
import { NavController, PopoverController } from '@ionic/angular';
import { finalize, take } from 'rxjs/operators';
import { OK } from '../../../../shared/constants/URLs';
import { AlertService } from '../../../../shared/services/alert/alert.service';
import { AuthService } from '../../../../shared/services/auth/auth.service';
import { HttpService } from '../../../../shared/services/http/http.service';
import { LoadingService } from '../../../../shared/services/loading/loading.service';
import { ToastService } from '../../../../shared/services/toast/toast.service';
import { SignOutRequest } from '../../../login/login.page';
import { StoreService } from '../../../../shared/services/store/store.service';
import { ReaderService } from '../../../../shared/services/reader/reader.service';


@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss']
})
export class PopoverComponent implements OnInit {

  constructor(
    private popover: PopoverController,
    private auth: AuthService,
    private http: HttpService,
    private loadingService: LoadingService,
    private toastService: ToastService,
    private alertService: AlertService,
    private navController: NavController,
    private storeService: StoreService,
    private readerService: ReaderService,
    private authService: AuthService
  ) { }

  ngOnInit() {

  }

  public closePopover(): void {
    this.popover.dismiss();
  }

  public async signOut(): Promise<void> {
    const operatorId = await this.storeService.get('operatorId')
    const loginSource = this.auth.loginSource

    const signOutRequest: SignOutRequest = { loginSource: loginSource }
    this.loadingService.presentLoading();
    (await this.http.signOut(signOutRequest))
      .pipe(take(1), finalize(() => this.loadingService.dismissLoading()))
      .subscribe(
        res => {
          if (res.statusCode != OK) {
            console.error("status code: " + res.statusCode)
            console.error("description: " + res.description)
            this.toastService.displayToast(res.descriptionForUserHE, 3 * 1000, "danger");
            return
          }

          if (res.data[0].loginTime !== undefined) {
            this.closePopover()
            this.storeService.clear()
            this.http.clear()
            this.authService.loginStatus = 'NOT_CONNECTED'
            this.navController.navigateRoot('login/' + operatorId, { replaceUrl: true })
          }
        },
        error => this.alertService.displayErrorFromServer(error)
      )

  }



}

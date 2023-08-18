import { OPERATOR } from './../../shared/constants/Config';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { finalize, take } from 'rxjs/operators';
import GlobalDataResponse from '../../model/inbound-payload/GlobalDataResponse';
import UserSignInResponse from '../../model/inbound-payload/UserSignInResponse';
import { OK} from '../../shared/constants/URLs';
import { AlertService } from '../../shared/services/alert/alert.service';
import { AuthService } from '../../shared/services/auth/auth.service';
import { MyElectronService } from '../../shared/services/electron/my-electron.service';
import { HttpService } from '../../shared/services/http/http.service';
import { LoadingService } from '../../shared/services/loading/loading.service';
import { StoreService } from '../../shared/services/store/store.service';
import { ToastService } from '../../shared/services/toast/toast.service';
import { SettingsService } from '../../shared/services/settings/settings.service';


export interface SignInRequest {
  email: string
  password: string
  operator_id: string
  loginSource: string
  rememberMe: string
  withUserData: string
  withCluster: string
}

export interface SignOutRequest {
  loginSource?: string
}

export interface ResetPasswordRequest {
  email: string
}

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, AfterViewInit {


  email: string;
  password: string;
  rememberMe: string;
  operatorId: string;
  withUserData: string;
  withCluster: string;
  loginSource: string;
  mailToReset: string;
  session: string;
  uid: string;
  operator: string = OPERATOR.OPERATOR_ID
  showPinCode: boolean = false
  logo: string

  constructor(
    private settingsService: SettingsService,
    private route: ActivatedRoute,
    private auth: AuthService,
    private httpService: HttpService,
    private loadingService: LoadingService,
    private toastService: ToastService,
    private alertService: AlertService,
    private myElectronService: MyElectronService,
    private storeService: StoreService,
    private translateService: TranslateService,
    private navController: NavController
  ) {
    this.logo = OPERATOR.LOGO
   }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.checkLogin();
    }, 3000);
  }

  ngOnInit() {
  }


  private async initializeServer(): Promise<void> {

   this.myElectronService.installFiles()
    // Promise.all([onInstallFiles]).finally(() => console.log('Files are installed'))

  }


  public async signIn(form: NgForm): Promise<void> {

    const params = form.controls;
    this.email = params.email.value;
    this.password = params.password.value;
    this.rememberMe = params.rememberMe.value ? '1' : '0';

    this.route.paramMap.subscribe(params => {
      this.operatorId = params.get('id');
    });

    this.loginSource = this.auth.loginSource;
    this.withUserData = '1';
    this.withCluster = '0';

    const signInRequest: SignInRequest = {
      email: this.email,
      password: this.password,
      operator_id: this.operatorId,
      loginSource: this.loginSource,
      rememberMe: this.rememberMe,
      withUserData: this.withUserData,
      withCluster: this.withCluster
    };

    this.loadingService.presentLoading();
    (await this.httpService.signIn(signInRequest)).pipe(take(1), finalize(() => this.loadingService.dismissLoading()))
      .subscribe(
        async res => {
          if (res.statusCode != OK) {
            console.error("status code: " + res.statusCode);
            console.error("description: " + res.description);
            this.toastService.displayToast(res.descriptionForUserHE, 3 * 1000, "danger");
            await this.storeService.clear()
            return;
          }
          this.onSuccessfulSignIn(res)

        },
        error => this.alertService.displayErrorFromServer(error),
      );

  }

  private async onSuccessfulSignIn(res: GlobalDataResponse) {
    const data: UserSignInResponse = res.data;

    if (res.data.status !== 'login') {
      await this.storeData(data)
    }

    this.settingsService.updateDevice()
    let checkSettings = await this.checkSettings()
    if (!checkSettings) return

    // await this.initializeServer()
    this.navController.navigateRoot('home', { replaceUrl: false })
  }


  private async checkSettings(): Promise<boolean> {
    let readerId = await this.storeService.get('readerSettings')
    let samId = await this.storeService.get('samSettings')
    let printerId = await this.storeService.get('printerSettings')

    if (!readerId || !samId || !printerId) {
      this.loadingService.dismissLoading();
      let isSettingsConfirm = await this.alertService.displayErrorSystemSettings()
      if (isSettingsConfirm)
        this.navController.navigateRoot('home/settings', { replaceUrl: true })
      return false
    } else
      return true

  }

  async storeData(data: UserSignInResponse): Promise<void> {
    return new Promise<void>(async (resolve) => {
      await this.storeService.set('session', data.sessionData.session);
      await this.storeService.set('uid', data.sessionData.uid);
      await this.storeService.set('operatorId', data.userData.operatorId);
      await this.storeService.set('firstName', data.userData.firstName);
      await this.storeService.set('lastName', data.userData.lastName);
      await this.storeService.set('typeRoleId', data.userData.typeRoleId);
      resolve()
    })

  }

  public async checkLogin(): Promise<void> {

    this.session = await this.storeService.get('session')
    this.uid = await this.storeService.get('uid')
    this.operatorId = await this.storeService.get('operatorId')

    if (!this.operatorId || !this.uid || !this.session) {
      return
    }

    this.loadingService.presentLoading();
    (await this.httpService.checkLogin()).pipe(take(1))
      .subscribe(
        res => {
          if (res.statusCode != OK) {
            console.error("status code: " + res.statusCode);
            console.error("description: " + res.description);
            this.toastService.displayToast(res.descriptionForUserHE, 3 * 1000, "danger");
            this.storeService.clear()
            window.location.reload()
            return;
          }

          if (res.data.status === 'login')
            this.onSuccessfulSignIn(res);

        },
        error => this.alertService.displayErrorFromServer(error),
      );
  }


  public async resetPassword(): Promise<void> {

    if (!this.mailToReset) {
      this.toastService.displayToast(this.translateService.instant('App.Interactions.AuthMesseges.emailNotExist'), 3 * 1000, "danger");
      return
    }

    this.loadingService.presentLoading();
    const resetPasswordPayload: ResetPasswordRequest = { email: this.mailToReset };
    (await this.httpService.resetPassword(resetPasswordPayload)).pipe(take(1), finalize(() => this.loadingService.dismissLoading()))
      .subscribe(
        res => {
          if (res.result === 'true')
            this.toastService.displayToast(this.translateService.instant('App.Interactions.AuthMesseges.emailSentSuccessfully'), 3 * 1000, "success");
        },
        error => this.alertService.displayErrorFromServer(error),
      );
  }
}


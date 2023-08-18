import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Network } from '@capacitor/network';
import { NavController } from '@ionic/angular'
import { TranslateService } from '@ngx-translate/core'
import { Observable, of } from 'rxjs'
import { tap } from 'rxjs/operators'
import GlobalDataResponse from '../../../model/inbound-payload/GlobalDataResponse'
import { ResetPasswordRequest, SignInRequest, SignOutRequest } from '../../../pages/login/login.page'
import { EmployeeRequest } from '../../../pages/user-identification/user-identification.page'
import { ERROR_EXCEPTION_FROM_SERVER, EXCEPTION_FROM_MYDB, NO_PERMISSION, SESSION_FOR_UID_NOT_LOGIN, SESSION_OR_UID_NOT_EXIST } from '../../constants/URLs'
import { StoreService } from '../store/store.service'
import { ToastService } from '../toast/toast.service'
import SessionDataPayload from '../../../model/outbound-payload/SessionDataPayload'
import { StatusCardDataRequest } from '../../../pages/card-creation/card-creation.page'
import { Router } from '@angular/router';
import { OPERATOR } from '../../constants/Config';
import { SettingsReportRequest } from '../../../pages/settings/settings.page';



export enum reqType {
  GET,
  POST,
}

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private readonly WC = '$'
  private isNetworkConnected: boolean
  session: any
  uid: any
  operatorId: any


  constructor(
    private http: HttpClient,
    private translateService: TranslateService,
    private toastService: ToastService,
    private navController: NavController,
    private router: Router,
    private storeService: StoreService
  ) {
    this.setNetworkStatus()
    Network.addListener('networkStatusChange', (status) => {
      console.log("Network status changed", status.connected)

      if (this.isNetworkConnected === status.connected) return

      this.isNetworkConnected = status.connected
      this.displayToastOfNetworkStatus(status.connected)
    })
  }



  private readonly endpoints = {
    signIn: `${OPERATOR.SERVER_URL}login/signIn2`,
    signOut: `${OPERATOR.SERVER_URL}login/logout`,
    checkLogin: `${OPERATOR.SERVER_URL}login/checkLogin`,
    resetPassword: `${OPERATOR.SERVER_URL}login/resetPassword`,
    getEmployeeDetails: `${OPERATOR.SERVER_URL}employee/getEmployeeDetails`,
    statusCreateCardDriver: `${OPERATOR.SERVER_URL}android/statusCreateCardDriver`,
    createRecoveryCardEmployee: `${OPERATOR.SERVER_URL}android/createRecoveryCardEmployee`,
    updateRecoveryCardEmployee: `${OPERATOR.SERVER_URL}android/updateRecoveryCardEmployee`,
    getDevice: `${OPERATOR.SERVER_URL}devices/reportsDevices`,
    addDevice: `${OPERATOR.SERVER_URL}devices/addDevice`,
    updateDevice: `${OPERATOR.SERVER_URL}devices/updateDevice`
  }

  public async signIn(signInRequest: SignInRequest): Promise<Observable<GlobalDataResponse>> {
    return await this.doRequest(this.format(this.endpoints.signIn), reqType.POST, signInRequest, false, true) as Observable<GlobalDataResponse>
  }

  public async signOut(signOutRequest: SignOutRequest): Promise<Observable<GlobalDataResponse>> {
    return await this.doRequest(this.format(this.endpoints.signOut), reqType.POST, signOutRequest, false) as Observable<GlobalDataResponse>
  }

  public async checkLogin(): Promise<Observable<GlobalDataResponse>> {
    return await this.doRequest(this.format(this.endpoints.checkLogin), reqType.POST, false) as Observable<GlobalDataResponse>
  }

  public async resetPassword(resetPasswordRequest: ResetPasswordRequest): Promise<Observable<GlobalDataResponse>> {
    return await this.doRequest(this.format(this.endpoints.resetPassword), reqType.POST, resetPasswordRequest, false, true) as Observable<GlobalDataResponse>
  }

  public async getEmployeeDetails(employeeRequest: EmployeeRequest): Promise<Observable<GlobalDataResponse>> {
    return await this.doRequest(this.format(this.endpoints.getEmployeeDetails), reqType.POST, employeeRequest, true) as Observable<GlobalDataResponse>
  }

  public async createRecoveryCardEmployee(employeeRequest: EmployeeRequest): Promise<Observable<GlobalDataResponse>> {
    return await this.doRequest(this.format(this.endpoints.createRecoveryCardEmployee), reqType.POST, employeeRequest, true) as Observable<GlobalDataResponse>
  }

  public async updateRecoveryCardEmployee(employeeRequest: EmployeeRequest): Promise<Observable<GlobalDataResponse>> {
    return await this.doRequest(this.format(this.endpoints.updateRecoveryCardEmployee), reqType.POST, employeeRequest, true) as Observable<GlobalDataResponse>
  }

  public async statusCreateCardDriver(statusRequest: StatusCardDataRequest): Promise<Observable<GlobalDataResponse>> {
    return await this.doRequest(this.format(this.endpoints.statusCreateCardDriver), reqType.POST, statusRequest, true) as Observable<GlobalDataResponse>
  }

  public async getDevice(devicesRequest: SettingsReportRequest): Promise<Observable<GlobalDataResponse>> {
    return await this.doRequest(this.format(this.endpoints.getDevice), reqType.POST, devicesRequest, true) as Observable<GlobalDataResponse>
  }

  public async addDevice(devicesRequest: SettingsReportRequest): Promise<Observable<GlobalDataResponse>> {
    return await this.doRequest(this.format(this.endpoints.addDevice), reqType.POST, devicesRequest, true) as Observable<GlobalDataResponse>
  }

  public async updateDevice(devicesRequest: SettingsReportRequest): Promise<Observable<GlobalDataResponse>> {
    return await this.doRequest(this.format(this.endpoints.updateDevice), reqType.POST, devicesRequest, true) as Observable<GlobalDataResponse>
  }



  private format(base: string, ...args): string {
    if (base == null) return null
    let charsArray = Array.from(base)
    let argsIndex = 0
    charsArray.forEach((char, idx) => { if (char === this.WC) charsArray[idx] = args[argsIndex++] })
    return charsArray.join('')
  }

  private async doRequest(url: string, type: reqType, post?: any, isAuthorizedDisabled?: boolean, isLogin?: boolean) {
    if (this.isNetworkConnected) {
      switch (type) {
        case reqType.GET:
          return this.http.get(url)
            .pipe(tap(elem => this.globalErrorHandler(elem)))
          break
        case reqType.POST:
          let sessionDataPayload: SessionDataPayload

          if (!this.operatorId && !this.uid && !this.session) {
            this.session = await this.storeService.get('session')
            this.uid = await this.storeService.get('uid')
            this.operatorId = await this.storeService.get('operatorId')
          }

          sessionDataPayload = { operator_id: this.operatorId, uid: this.uid, session: this.session }

          if (isAuthorizedDisabled) {
            post = { ...post, ...{ sessionData: sessionDataPayload } }
          } else if (isLogin) {
            post = { ...post }
          } else {
            post = { ...post, ...sessionDataPayload }
          }

          return this.http.post(url, post)
            .pipe(tap(elem => this.globalErrorHandler(elem)))
          break

        default:
          return of(null)
          break
      }
    } else {
      return of(null)
    }
  }

  public async globalErrorHandler(response): Promise<void> {

    const operatorId = await this.storeService.get('operatorId')

    switch (response.statusCode + "") {
      case ERROR_EXCEPTION_FROM_SERVER:
      case EXCEPTION_FROM_MYDB:
      case SESSION_FOR_UID_NOT_LOGIN:
      case NO_PERMISSION:
      case SESSION_OR_UID_NOT_EXIST:

        if (this.router.url === 'login') return

        this.navController.navigateRoot('login/' + operatorId, { replaceUrl: true })
        break

      default:
        break
    }
  }

  private async setNetworkStatus() {
    this.isNetworkConnected = await (await Network.getStatus()).connected

    // if disconected internet in init app -> dispaly toast
    if (!this.isNetworkConnected) this.displayToastOfNetworkStatus(this.isNetworkConnected)
  }

  private async displayToastOfNetworkStatus(connected) {
    if (connected) this.toastService.displayToast(this.translateService.instant('App.Interactions.ServerError.online'), 3 * 1000, "success")
    else this.toastService.displayToast(this.translateService.instant('App.Interactions.ServerError.offline'), 99999 * 1000, "danger")
  }

  public async clear(): Promise<void> {
    this.session = null
    this.uid = null
    this.operatorId = null
  }

}

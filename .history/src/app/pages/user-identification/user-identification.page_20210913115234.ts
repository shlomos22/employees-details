import { Component, OnDestroy, OnInit } from '@angular/core'
import { NavController } from '@ionic/angular'
import { TranslateService } from '@ngx-translate/core'
import { finalize, take } from 'rxjs/operators'
import GlobalDataResponse from '../../model/inbound-payload/GlobalDataResponse'
import { OK } from '../../shared/constants/URLs'
import { Errors } from '../../shared/constants/errors'
import { AlertService } from '../../shared/services/alert/alert.service'
import { HttpService } from '../../shared/services/http/http.service'
import { LoadingService } from '../../shared/services/loading/loading.service'
import { ReaderService, ReaderStatus, ReceiveReaderMessage as ReaderReceiveMessage, ReceiveReaderMessage } from '../../shared/services/reader/reader.service';
import { ToastService } from '../../shared/services/toast/toast.service'
import { EmployeeService } from '../../shared/services/employee/employee.service'
import { CardReaderService, WriteDriverCard } from '../../shared/services/driver-card-write/card-driver.service'
import * as moment from 'moment'
import RecoveryCardEmployeePayload from '../../model/outbound-payload/RecoveryCardEmployeePayload'
import { ModalService } from '../../shared/services/modal/modal.service'
import { SuccesMessageComponent } from '../../shared/components/succes-message/succes-message.component'
import { FailedMessageComponent } from '../../shared/components/failed-message/failed-message.component'
import { PrinterService, PrinterStatus, Station, CardType } from '../../shared/services/printer/printer.service'
import { MyElectronService } from '../../shared/services/electron/my-electron.service'
import { OPERATOR } from '../../../../.history/src/app/shared/constants/Config.4_20210913111838';

export interface EmployeeRequest {
  data: EmployeeData | RecoveryCardData | UpdateRecoveryCardData
}

export interface EmployeeData {
  typeEmployee: string
  isActive: string
  idNumber: string
}

export interface RecoveryCardData {
  cardType: string
  cardSerial: string
}

export interface UpdateRecoveryCardData {
  cardType: string
  status: string
  idNumber: string
  branchCode: string
  startDt: string
  endDt: string
  cardNumber: string
}

const CARD_TYPE = '2'
const UPDATE_RECOVERY_FIRST_NAME = 'כרטיס'
const UPDATE_RECOVERY_LAST_NAME = 'גיבוי'

export enum UpdateCardStatus {
  success = 1,
  start,
  failed
}

@Component({
  selector: 'app-user-identification',
  templateUrl: './user-identification.page.html',
  styleUrls: ['./user-identification.page.scss'],
})
export class UserIdentificationPage implements OnInit {

  idNumber: string
  cardSerial: string
  readerStatus: string
  isPrinting: boolean = false
  showBackupButton = OPERATOR.BACKUP_CARD


  constructor(
    private http: HttpService,
    private loadingService: LoadingService,
    private toastService: ToastService,
    private alertService: AlertService,
    private navController: NavController,
    private employeeService: EmployeeService,
    private translateService: TranslateService,
    private cardReaderService: CardReaderService,
    private readerService: ReaderService,
    private modalService: ModalService,
    private printerService: PrinterService,
    private myElectronService: MyElectronService,
  ) { }

  async ngOnInit() {
    this.loadingService.dismissLoading()
    setTimeout(async () => {
      await this.myElectronService.runReaderJar()
    }, 2000);
    setTimeout(async () => {
      await this.myElectronService.runPrinterJar()
    }, 2000);
  }

  public async getEmployeeDetails(): Promise<void> {
    this.loadingService.presentLoading()

    const data = { typeEmployee: '-999', isActive: '-999', idNumber: this.idNumber + "" }
    const cardDriverRequest: EmployeeRequest = { data: data };
    (await this.http.getEmployeeDetails(cardDriverRequest)).pipe(take(1), finalize(() => this.loadingService.dismissLoading()))
      .subscribe(
        res => {
          if (res.statusCode != OK) {
            console.error("status code: " + res.statusCode)
            console.error("description: " + res.description)
            this.toastService.displayToast(res.descriptionForUserHE, 3 * 1000, "danger")
            this.http.globalErrorHandler(res)
            return
          }

          if (res.data.length > 0) {
            this.onSuccessfulgetEmployeeDetails(res)
          } else {
            this.toastService.displayToast(this.translateService.instant('Pages.UserId.ServerError.employeeNotExist'), 3 * 1000, "danger")
          }
        },
        error => this.alertService.displayErrorFromServer(error)
      )
  }

  private onSuccessfulgetEmployeeDetails(res: GlobalDataResponse) {
    this.employeeService.setEmployeeDetails(res)

    this.navController.navigateRoot('home/card-creation', { replaceUrl: true })
  }

  public async createBackupCard(): Promise<void> {

    const confirmation = await this.alertService.displayRecoveryCardEmployee()
    if (!confirmation) return

    this.isPrinting = true

    if (!this.readerService.isInitReader) {
      await this.readerService.initReaders()
      this.readerService.isInitReader = true
    }

    let pmsg = await this.printerService.moveTo(Station.ICLASS)
    if (pmsg.status === PrinterStatus.FAILED) {
      this.modalService.presentModal(FailedMessageComponent, pmsg.errors[0].error)
      this.isPrinting = false
      return
    }

    let rmsg = await this.readerService.reader()
    if (rmsg.status === ReaderStatus.DISCONNECTED) {
      this.modalService.presentModal(FailedMessageComponent, Errors.READER_NOT_EXISTS)
      this.isPrinting = false
      return
    }

    if (!rmsg.cardExists) {
      this.modalService.presentModal(FailedMessageComponent, Errors.CARD_NOT_EXISTS)
      this.isPrinting = false
      return
    }

    rmsg = await this.readDriverCard(rmsg.status)
    if (rmsg.status === ReaderStatus.SUCCESS) {
      if (await this.createRecoveryCardEmployee())
        await this.printCard()
    }
  }

  public async readDriverCard(readerStatus: string): Promise<ReceiveReaderMessage> {
    let rmsg: any
    if (readerStatus === ReaderStatus.READY) {
      rmsg = await this.readerService.readIsrDriverCard()
      if (rmsg.status === ReaderStatus.SUCCESS)
        this.cardSerial = rmsg.cardSerialNumber
    }
    return rmsg;
  }

  public async createRecoveryCardEmployee(): Promise<boolean> {

    let isSuccess = true
    const data = { cardType: CARD_TYPE, cardSerial: this.cardSerial }
    const createRecoveryRequest: EmployeeRequest = { data: data };
    (await this.http.createRecoveryCardEmployee(createRecoveryRequest)).pipe(take(1), finalize(() => this.loadingService.dismissLoading()))
      .subscribe(
        res => {
          if (res.statusCode != OK) {
            console.error("status code: " + res.statusCode)
            console.error("description: " + res.description)
            this.toastService.displayToast(res.descriptionForUserHE, 3 * 1000, "danger")
            this.http.globalErrorHandler(res)
            return
          }
          if (this.onSuccessfulgetRecoveryCardEmployeeDetails(res))
            isSuccess = true
          else
            isSuccess = false

        },
        error => this.alertService.displayErrorFromServer(error)
      )
    return isSuccess
  }

  private async onSuccessfulgetRecoveryCardEmployeeDetails(res: GlobalDataResponse): Promise<boolean> {

    const driverCard = this.cardReaderService.getDriverCard()
    const data: RecoveryCardEmployeePayload = res.data
    driverCard.driverEnviroment.employeeIdNumber = parseInt(data.recoveryCardEmployeeId)
    driverCard.driverEnviroment.employeeLanguage = parseInt(data.employeeLanguage, 10)
    driverCard.driverEnviroment.employeePinCode = parseInt(data.employeePinCode, 10)
    driverCard.driverEnviroment.envEndDate = data.employeeRole1Date
    driverCard.driverEnviroment.envIssuingDate = moment().format('YYYY-MM-DD')
    driverCard.driverEnviroment.employeeRole1Code = parseInt(data.employeeRole1Code, 10)
    driverCard.driverEnviroment.employeeRole1Date = data.employeeRole1Date
    driverCard.driverEnviroment.envIssuerId = parseInt(data.envIssuerId, 10)
    driverCard.driverEnviroment.employeeIsBackUpCard = 1

    await this.updateRecoveryCardEmployee(UpdateCardStatus.start.toString())

    let msg = await this.readerService.writeIsrDriverCard(driverCard)
    if (msg.status === ReaderStatus.READY || msg.status === ReaderStatus.CONNECTED)
      return false

    if (msg.status === ReaderStatus.SUCCESS) {
      await this.updateRecoveryCardEmployee(UpdateCardStatus.success.toString())
      return true
    } else {
      await this.updateRecoveryCardEmployee(UpdateCardStatus.failed.toString())
      return false
    }
  }

  public async updateRecoveryCardEmployee(status: string): Promise<void> {

    const data: UpdateRecoveryCardData = { cardNumber: this.cardSerial, status: status, cardType: CARD_TYPE, idNumber: '-99', branchCode: '-99', startDt: '0', endDt: '0' };
    const createRecoveryRequest: EmployeeRequest = { data: data };
    (await this.http.updateRecoveryCardEmployee(createRecoveryRequest)).pipe(take(1), finalize(() => this.loadingService.dismissLoading()))
      .subscribe(
        res => {
          if (res.statusCode != OK) {
            console.error("status code: " + res.statusCode)
            console.error("description: " + res.description)
            this.toastService.displayToast(res.descriptionForUserHE, 3 * 1000, "danger")
            this.http.globalErrorHandler(res)
            return
          }
          if (res.data[0].statusCode !== OK) {
            this.toastService.displayToast(res.data[0].statusDescr, 3 * 1000, "danger")
          }
        },
        error => this.alertService.displayErrorFromServer(error)
      )
  }

  public async printCard(): Promise<void> {
    let msg = await this.printerService.printImage(
      UPDATE_RECOVERY_FIRST_NAME,
      UPDATE_RECOVERY_LAST_NAME,
      '',
      '1',
      CardType.DRIVER_CARD
    )
    if (msg.status === PrinterStatus.SUCCESS)
      this.modalService.presentModal(SuccesMessageComponent)
    else
      this.modalService.presentModal(FailedMessageComponent, Errors.WRITE_ISR_DRIVER_CARD_FAILED)

    this.isPrinting = false
  }


}

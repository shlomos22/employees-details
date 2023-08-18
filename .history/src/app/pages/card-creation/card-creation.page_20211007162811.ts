import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core'
import { NavController } from '@ionic/angular'
import { ImageCroppedEvent } from 'ngx-image-cropper'
import { Employee, EmployeeService } from '../../shared/services/employee/employee.service'
import * as moment from 'moment'
import { SendMessage, ReaderService, ReaderStatus, ReceiveReaderMessage } from '../../shared/services/reader/reader.service'
import { StoreService } from '../../shared/services/store/store.service';
import { CardReaderService, WriteDriverCard } from '../../shared/services/driver-card-write/card-driver.service'
import { ModalService } from '../../shared/services/modal/modal.service'
import { FailedMessageComponent } from '../../shared/components/failed-message/failed-message.component'
import { Errors } from '../../shared/constants/errors'
import { UpdateCardStatus } from '../user-identification/user-identification.page'
import { HttpService } from '../../shared/services/http/http.service'
import { take } from 'rxjs/operators'
import { ToastService } from '../../shared/services/toast/toast.service'
import { AlertService } from '../../shared/services/alert/alert.service'
import { OK } from '../../shared/constants/URLs'
import { SuccesMessageComponent } from '../../shared/components/succes-message/succes-message.component'
import { CardType, PrinterService, PrinterStatus, ReceivePrinterMessage, Station } from '../../shared/services/printer/printer.service'
import { IMAGE_PATH } from '../../shared/constants/files'
import { ElectronService } from '../../core/services/electron/electron.service'
import { TranslateService } from '@ngx-translate/core'
import { PrintMessageComponent } from '../../shared/components/print-message/print-message.component'
import { OPERATOR } from '../../shared/constants/Config'



export interface StatusCardDataRequest {
  data: StatusCreateCardData
}

export interface StatusCreateCardData {
  cardNumber: string
  employeeIdNumber: string
  status: string
}

export const RoleType = {
  DRIVER: '1',
  TECHNICIAN: '2',
  MANAGER: '3',
  CONTROL: '4',
  OPERATION: '5',
  CONTROLLER: '6',
  TELLER: '7',
  VISITOR_MANAGER: '8',
}

@Component({
  selector: 'app-card-creation',
  templateUrl: './card-creation.page.html',
  styleUrls: ['./card-creation.page.scss'],
})
export class CardCreationPage implements OnInit {

  showPinCode = false
  cardDataInputs: Employee
  croppedImage: any
  userName: string
  id: string
  cardType: string[] = []
  cardSerial: any
  isTakenAPicture: string = '1'
  msg: ReceivePrinterMessage
  isPrintingProcess:boolean = false
  isEmployee: boolean = false
  isDriver: boolean = false
  isMagneticEncoderExist: boolean = OPERATOR.MAGNETIC_ENCODER

  constructor(
    private http: HttpService,
    private employeeService: EmployeeService,
    private navController: NavController,
    private cardReaderService: CardReaderService,
    private readerService: ReaderService,
    private storeService: StoreService,
    private modalService: ModalService,
    private toastService: ToastService,
    private alertService: AlertService,
    private printerService: PrinterService,
    private electronService: ElectronService,
    private translateService: TranslateService
  ) { }


  ngOnInit() {
    this.cardDataInputs = this.employeeService.getEmployeeCardData()
    this.userName = this.employeeService.getUserName()
    this.id = this.employeeService.idNumber
    this.cardType = this.getCardType()
  }

  public async getPicture(event: ImageCroppedEvent): Promise<void> {
    this.croppedImage = await event.base64
  }

  private savePicture(): string {
    if (!this.croppedImage) return '1'

    const image: any = this.croppedImage

    const base64Data = image.replace(/^data:image\/png;base64,/, "");
    const filePath = IMAGE_PATH + 'image.jpg'
    this.electronService.fs.writeFile(filePath, base64Data, 'base64', (err) => {
      console.log(err);
      return '1'
    })
    return '0'
  }

  public openSettings(): void {
    this.navController.navigateRoot('home/settings', { replaceUrl: true })
  }

  public clearAll(): void {
    this.employeeService.clearAll()
    this.navController.navigateRoot('home', { replaceUrl: true })
  }

  public async createCard() {

    this.isTakenAPicture = this.savePicture()
    if (this.isTakenAPicture === '1') {
      this.toastService.displayToast(this.translateService.instant('Pages.CardCreation.pictureNotFound'), 3 * 1000, "danger")
      return
    }

    if (this.employeeService.cardSerial && this.employeeService.cardStatus == UpdateCardStatus.success.toString()) {
      const confirmation = await this.alertService.displayCreateEmployeeCard()
      if (!confirmation) return
    }

    this.isPrintingProcess = true

    this.isDriver = this.cardType.includes('driver') ? true : false
    this.isEmployee = this.cardType.includes('employee') ? true : false

    if (!await this.readerService.initReaders()) return

    this.modalService.presentModal(PrintMessageComponent)
    switch (this.isMagneticEncoderExist) {
      case true:
        if (this.isDriver && !this.isEmployee) {
          this.createDriverCard()
        } else if (!this.isDriver && this.isEmployee) {
          this.createEmployeeCard()
        } else if (this.isDriver && this.isEmployee) {
          this.createComboCard()
        }
        break;
      case false:
        this.craeteCardWithoutCoding()
        break;
    }
  }




  private getCardType(): string[] {
    let typeRoleIds: string[] = []
    if (this.employeeService.role1CodeType != '') {
      typeRoleIds = [...typeRoleIds, this.employeeService.role1CodeType]
    }

    if (this.employeeService.role2CodeType != '') {
      typeRoleIds = [...typeRoleIds, this.employeeService.role2CodeType]
    }

    let isDriver = ''
    let isEmployee = ''

    for (let i = 0; i < typeRoleIds.length; i++) {
      switch (typeRoleIds[i]) {
        case RoleType.DRIVER:
        case RoleType.TECHNICIAN:
        case RoleType.CONTROLLER:
          isDriver = 'driver'
          break;
        case RoleType.MANAGER:
        case RoleType.CONTROL:
        case RoleType.OPERATION:
        case RoleType.TELLER:
        case RoleType.VISITOR_MANAGER:
          isEmployee = 'employee'
          break
        default:
          break;
      }
    }

    typeRoleIds = []
    typeRoleIds = [...typeRoleIds, isDriver, isEmployee]
    return typeRoleIds
  }

  private async createComboCard(): Promise<void> {
    let pmsg = await this.printerService.moveTo(Station.ICLASS)
    if (pmsg.status === PrinterStatus.FAILED) {
      this.isPrintingProcess = false
      this.modalService.dismiss()
      this.modalService.presentModal(FailedMessageComponent, pmsg.errors[0].error)
      return
    }

    let rmsg = await this.readerService.reader()
    if (rmsg.status === ReaderStatus.DISCONNECTED) {
      this.isPrintingProcess = false
      this.modalService.dismiss()
      this.modalService.presentModal(FailedMessageComponent, Errors.READER_NOT_EXISTS)
      return
    }

    if (!rmsg.cardExists) {
      this.isPrintingProcess = false
      this.modalService.dismiss()
      this.modalService.presentModal(FailedMessageComponent, Errors.CARD_NOT_EXISTS)
      return
    }

    rmsg = await this.readDriverCard(rmsg.status)
    if (rmsg.status === ReaderStatus.SUCCESS) {
      if (await this.writeDriverCard())
        await this.printCombo()
    }

  }

  private async createEmployeeCard(): Promise<void> {

    await this.statusCreateDriverCard(this.employeeService.idNumber, UpdateCardStatus.start.toString())

    let pmsg = await this.printerService.printCombo(
      this.employeeService.firstName,
      this.employeeService.lastName,
      this.employeeService.idNumber,
      this.isTakenAPicture,
      CardType.EMPLOYEE_CARD,
      this.employeeService.idNumber
    )
    this.isPrintingProcess = false
    this.modalService.dismiss()
    if (pmsg.status === PrinterStatus.SUCCESS) {
      this.msg = pmsg
      await this.statusCreateDriverCard(this.employeeService.idNumber, UpdateCardStatus.success.toString())
        .then(() => this.modalService.presentModal(SuccesMessageComponent))
    } else {
      await this.statusCreateDriverCard(this.employeeService.idNumber, UpdateCardStatus.failed.toString())
        .then(() => this.modalService.presentModal(FailedMessageComponent, Errors.WRITE_ISR_DRIVER_CARD_FAILED))
    }
  }

  private async createDriverCard(): Promise<void> {
    let pmsg = await this.printerService.moveTo(Station.ICLASS)
    if (pmsg.status === PrinterStatus.FAILED) {
      this.isPrintingProcess = false
      this.modalService.dismiss()
      this.modalService.presentModal(FailedMessageComponent, pmsg.errors[0].error)
      return
    }

    let rmsg = await this.readerService.reader()
    if (rmsg.status === ReaderStatus.DISCONNECTED) {
      this.isPrintingProcess = false
      this.modalService.dismiss()
      this.modalService.presentModal(FailedMessageComponent, Errors.READER_NOT_EXISTS)
      return
    }

    if (!rmsg.cardExists) {
      this.isPrintingProcess = false
      this.modalService.dismiss()
      this.modalService.presentModal(FailedMessageComponent, Errors.CARD_NOT_EXISTS)
      return
    }

    rmsg = await this.readDriverCard(rmsg.status)
    if (rmsg.status === ReaderStatus.SUCCESS) {
      if (await this.writeDriverCard())
      console.log('The card was created successfully');

        // await this.printCard(CardType.DRIVER_CARD)
    }

  }

  private async craeteCardWithoutCoding() {
    let pmsg = await this.printerService.moveTo(Station.ICLASS)
    if (pmsg.status === PrinterStatus.FAILED) {
      this.isPrintingProcess = false
      this.modalService.dismiss()
      this.modalService.presentModal(FailedMessageComponent, pmsg.errors[0].error)
      return
    }

    let rmsg = await this.readerService.reader()
    if (rmsg.status === ReaderStatus.DISCONNECTED) {
      this.isPrintingProcess = false
      this.modalService.dismiss()
      this.modalService.presentModal(FailedMessageComponent, Errors.READER_NOT_EXISTS)
      return
    }

    if (!rmsg.cardExists) {
      this.isPrintingProcess = false
      this.modalService.dismiss()
      this.modalService.presentModal(FailedMessageComponent, Errors.CARD_NOT_EXISTS)
      return
    }

    rmsg = await this.readDriverCard(rmsg.status)
    if (rmsg.status === ReaderStatus.SUCCESS) {
      if (await this.writeDriverCard()) {
        let cardType
        if (this.isDriver && !this.isEmployee) {
          cardType = CardType.DRIVER_CARD
        } else if (!this.isDriver && this.isEmployee) {
          cardType = CardType.EMPLOYEE_CARD
        } else if (this.isDriver && this.isEmployee) {
          cardType = CardType.EMPLOYEE_CARD
        }
        await this.printCard(cardType)
      }
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

  public async writeDriverCard(): Promise<boolean> {

    const driverCard = await this.loadDriverCardObj()
    await this.statusCreateDriverCard(this.cardSerial, UpdateCardStatus.start.toString())

    let msg = await this.readerService.writeIsrDriverCard(driverCard)
    if (msg.status === ReaderStatus.READY || msg.status === ReaderStatus.CONNECTED)
      return false

    if (msg.status === ReaderStatus.SUCCESS) {
      await this.statusCreateDriverCard(this.cardSerial, UpdateCardStatus.success.toString())
      return true
    } else {
      await this.statusCreateDriverCard(this.cardSerial, UpdateCardStatus.failed.toString())
      return false
    }
  }


  public async printCard(cadType: string): Promise<void> {
    let msg = await this.printerService.printImage(
      this.employeeService.firstName,
      this.employeeService.lastName,
      this.employeeService.idNumber,
      this.isTakenAPicture,
      cadType,
    )
    this.isPrintingProcess = false
    this.modalService.dismiss()
    if (msg.status === PrinterStatus.SUCCESS)
      this.modalService.presentModal(SuccesMessageComponent)
    else
      this.modalService.presentModal(FailedMessageComponent, Errors.WRITE_ISR_DRIVER_CARD_FAILED)
  }

  public async printCombo(): Promise<void> {
    let msg = await this.printerService.printCombo(
      this.employeeService.firstName,
      this.employeeService.lastName,
      this.employeeService.idNumber,
      this.isTakenAPicture,
      CardType.EMPLOYEE_CARD,
      this.employeeService.idNumber
    )

    this.isPrintingProcess = false
    this.modalService.dismiss()
    if (msg.status === PrinterStatus.SUCCESS)
      this.modalService.presentModal(SuccesMessageComponent)
    else
      this.modalService.presentModal(FailedMessageComponent, Errors.WRITE_ISR_DRIVER_CARD_FAILED)
  }


  public async statusCreateDriverCard(cardNumber: string, status: string) {
    const data: StatusCreateCardData = { cardNumber: cardNumber, employeeIdNumber: this.employeeService.idNumber, status: status };
    const statusCardDriverRequest: StatusCardDataRequest = { data: data };
    (await this.http.statusCreateCardDriver(statusCardDriverRequest)).pipe(take(1))
      .subscribe(
        res => {
          if (res.statusCode != OK) {
            console.error("status code: " + res.statusCode)
            console.error("description: " + res.description)
            this.modalService.dismiss()
            this.modalService.presentModal(FailedMessageComponent, Errors.WRITE_ISR_DRIVER_CARD_FAILED)
            return
          }
          if (res.data[0].F1_Status !== 'OK') {
            this.toastService.displayToast(res.data[0].F1, 3 * 1000, "danger")
          }
        },
        error => this.alertService.displayErrorFromServer(error)
      )
  }

  public async loadDriverCardObj(): Promise<WriteDriverCard> {
    const driverCard = this.cardReaderService.getDriverCard()
    driverCard.driverEnviroment.employeeIdNumber = this.employeeService.getNumber(this.employeeService.idNumber)
    driverCard.driverEnviroment.employeeLanguage = this.employeeService.getLanguage(this.cardDataInputs.employeeMainLanguage.value)
    driverCard.driverEnviroment.employeePinCode = this.employeeService.getNumber(this.cardDataInputs.employeePinCode.value)
    driverCard.driverEnviroment.employeeRole1Code = this.employeeService.getNumber(this.employeeService.role1CodeType)
    driverCard.driverEnviroment.employeeRole1Date = this.employeeService.getDate(this.cardDataInputs.employeeRole1Date.value)
    driverCard.driverEnviroment.employeeRole2Code = this.employeeService.getRoleCode(this.employeeService.role2CodeType)
    driverCard.driverEnviroment.employeeRole2Date = this.employeeService.getRoleDate(this.cardDataInputs.employeeRole2Date.value)
    driverCard.driverEnviroment.envIssuerId = this.employeeService.getNumber(await this.storeService.get('operatorId'))
    driverCard.driverEnviroment.envIssuingDate = this.employeeService.getDate(this.cardDataInputs.envIssuingDate.value)
    driverCard.driverEnviroment.envEndDate = this.employeeService.getDate(this.cardDataInputs.envEndDate.value)
    driverCard.driverHeader.lastUnloadingDate = moment().format('YYYY-MM-DDTHH:mm:ss')

    return driverCard
  }
}

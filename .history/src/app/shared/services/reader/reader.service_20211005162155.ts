import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'
import { WebsocketService } from '../websocket/websocket.service'
import { map } from 'rxjs/operators'
import { FailedMessageComponent } from '../../components/failed-message/failed-message.component'
import { ModalService } from '../modal/modal.service'
import { Errors } from '../../constants/errors'
import { WriteDriverCard } from '../driver-card-write/card-driver.service'
import { StoreService } from '../store/store.service'
import { OtherDevicesPayload } from '../../../pages/settings/settings.page'
import { AlertService } from '../alert/alert.service'
import { NavController } from '@ionic/angular'


const READER_URL = 'ws://localhost/'

export interface SendMessage {
  command: string
  cardReaderIndex?: string
  samReaderIndex?: string
}

export interface ReceiveReaderMessage {
  cardExists?: boolean
  cardReaderName?: string
  command: string
  samReaderName?: string
  samType?: string
  status: string
  contractsInfoTexts?: Array<object>
  environmentInfoText?: object
  eventsInfoTexts?: Array<object>
  driverEnviroment?: object
  driverHeader?: object
  driverShifts?: Array<object>
  cardSerialNumber?: string
  cardReaders?: Array<ReaderSamObj>
  samReaders?: Array<ReaderSamObj>
}

export interface ReaderSamObj {
  name: string
  index: number
}

export const Command = {
  GET_READERS: 'getReaders',
  CONNECT_TO_READERS: 'connectToReaders',
  READER: 'reader',
  CARD_INFO: 'cardInfo',
  RAED_ISR_DRIVER_CARD: 'readIsrDriverCard',
  WRIT_ISR_DRIVER_CARD: 'writeIsrDriverCard'
}

export const ReaderStatus = {
  CONNECTED: `Connected`,
  DISCONNECTED: `Disconnected`,
  READY: `Ready`,
  SUCCESS: `Success`,
  FAILED: `Failed`
}


@Injectable({
  providedIn: 'root'
})
export class ReaderService {

  public messages: Subject<SendMessage | ReceiveReaderMessage>
  readerObj: ReaderSamObj[]
  samObj: ReaderSamObj[]

  constructor(private wsService: WebsocketService, private modalService: ModalService, private storeService: StoreService, private alertService: AlertService, private navController: NavController) {
    this.messages = <Subject<SendMessage | ReceiveReaderMessage>>wsService.connect(READER_URL).pipe(map(
      (response: MessageEvent): ReceiveReaderMessage => {
        let data = JSON.parse(response.data)

        switch (data.command) {
          case "getReaders":
            return this.handleGetReaders(data)
          case "connectToReaders":
            return this.handleReaderStatus(data)
          case "reader":
            return this.handleReaderStatus(data)
          case "cardInfo":
            return this.handleCardInfo(data)
          case "readIsrDriverCard":
            return this.handleISRDriverCardInfo(data)
          case "writeIsrDriverCard":
            return this.handleIsrDriverWrite(data)
        }
      }
    ))
  }

  handleGetReaders(getReaders: ReceiveReaderMessage): ReceiveReaderMessage {
    let status = {
      cardReaders: getReaders.cardReaders,
      samReaders: getReaders.samReaders,
      command: getReaders.command,
      status: getReaders.status
    }
    return status
  }

  private handleReaderStatus(readerStatus: ReceiveReaderMessage): ReceiveReaderMessage {
    let status = {
      cardExists: readerStatus.cardExists,
      cardReaderName: readerStatus.cardReaderName,
      command: readerStatus.command,
      samReaderName: readerStatus.samReaderName,
      samType: readerStatus.samType,
      status: readerStatus.status,
    }
    return status
  }

  private handleCardInfo(cardInfo: ReceiveReaderMessage): ReceiveReaderMessage {
    let info = {
      command: cardInfo.command,
      contractsInfoTexts: cardInfo.contractsInfoTexts,
      environmentInfoText: cardInfo.environmentInfoText,
      eventsInfoTexts: cardInfo.eventsInfoTexts,
      status: cardInfo.status,
    }
    return info
  }

  private handleISRDriverCardInfo(isrDriverCardInfo: ReceiveReaderMessage): ReceiveReaderMessage {
    let info = {
      command: isrDriverCardInfo.command,
      driverEnviroment: isrDriverCardInfo.driverEnviroment,
      driverHeader: isrDriverCardInfo.driverHeader,
      driverShifts: isrDriverCardInfo.driverShifts,
      cardSerialNumber: isrDriverCardInfo.cardSerialNumber,
      status: isrDriverCardInfo.status
    }
    return info
  }

  private handleIsrDriverWrite(isrDriverCardWriteResponse: ReceiveReaderMessage): ReceiveReaderMessage {
    let response = {
      command: isrDriverCardWriteResponse.command,
      status: isrDriverCardWriteResponse.status
    }
    return response
  }

  public restartServer() {
    this.messages.next({ command: "hello" })
    console.log("Successfully connected")
  }

  public async initReaders(): Promise<boolean> {
    let msg = await this.getReaders()

    if (msg.command === 'getReaders') {
      let cardReaders = msg.cardReaders
      let samReaders = msg.samReaders

      let isReaderOrSamExists = await this.checkIsReaderOrSamExists(cardReaders, samReaders)
      if (!isReaderOrSamExists) {
        return false
      } else {
        return true
      }

    }
  }

  private async checkIsReaderOrSamExists(cardReaders: ReaderSamObj[], samReaders: ReaderSamObj[]): Promise<boolean> {

    const reader = await this.storeService.get('readerSettings')
    const sam = await this.storeService.get('samSettings')

    if (!reader || !sam) {
      let isSettingsConfirm = await this.alertService.displayErrorSystemSettings()
      if (isSettingsConfirm)
        this.navController.navigateRoot('home/settings', { replaceUrl: true })
      return false
    }

    const readerSettings = (JSON.parse(reader) as OtherDevicesPayload).deviceSerNum
    const samSettings = (JSON.parse(sam) as OtherDevicesPayload).deviceSerNum
    this.readerObj = cardReaders.filter(reader => reader.name === readerSettings)
    this.samObj = samReaders.filter(sam => sam.name === samSettings)

    if (this.readerObj.length <= 0) {
      this.modalService.presentModal(FailedMessageComponent, Errors.READER_NOT_EXISTS)
      return false
    }

    if (this.samObj.length <= 0) {
      this.modalService.presentModal(FailedMessageComponent, Errors.SAM_NOT_EXISTS)
      return false
    }

    const isConnect = await this.connectToReaders(this.readerObj[0].index.toString(), this.samObj[0].index.toString())
    setTimeout(() => {
      if (isConnect.status !== ReaderStatus.READY || ReaderStatus.CONNECTED) {
        return false
      }
    }, 1000);


    return true
  }

  public connectToReaders(cardReaderIndex: string, samReaderIndex: string): Promise<ReceiveReaderMessage> {
    return new Promise(resolve => {
      this.messages.next({
        command: Command.CONNECT_TO_READERS,
        cardReaderIndex: cardReaderIndex,
        samReaderIndex: samReaderIndex
      })
      this.messages.subscribe((msg: any) => {
        console.log("Response from websocket: ")
        console.log(msg)
        resolve(msg)
      })
    })
  }

  public getReaders(): Promise<ReceiveReaderMessage> {
    return new Promise(resolve => {
      this.messages.next({
        command: Command.GET_READERS,
      })
      this.messages.subscribe((msg: any) => {
        console.log("Response from websocket: ")
        console.log(msg)
        resolve(msg)
      })
    })
  }

  public reader(): Promise<ReceiveReaderMessage> {
    return new Promise(resolve => {
      this.messages.next({
        command: Command.READER
      })
      this.messages.subscribe((msg: any) => {
        console.log("Response from websocket: ")
        console.log(msg)
        resolve(msg)
      })
    })
  }

  public readIsrDriverCard(): Promise<ReceiveReaderMessage> {
    return new Promise(resolve => {
      this.messages.next({
        command: Command.RAED_ISR_DRIVER_CARD
      })
      this.messages.subscribe((msg: any) => {
        console.log("Response from websocket: ")
        console.log(msg)
        resolve(msg)
      })
    })
  }

  public writeIsrDriverCard(driverCard: WriteDriverCard): Promise<ReceiveReaderMessage> {
    return new Promise(resolve => {
      this.messages.next({
        command: Command.WRIT_ISR_DRIVER_CARD,
        driverEnviroment: driverCard.driverEnviroment,
        driverHeader: driverCard.driverHeader,
        driverShifts: driverCard.driverShifts

      })
      this.messages.subscribe((msg: any) => {
        console.log("Response from websocket: ")
        console.log(msg)
        resolve(msg)
      })
    })
  }

}

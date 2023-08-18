import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { OtherDevicesPayload } from '../../../pages/settings/settings.page';
import { StoreService } from '../store/store.service';
import { WebsocketService } from '../websocket/websocket.service';

const PRINTER_URL = 'ws://localhost:8025/'

export interface ReceivePrinterMessage {
  command: string
  status: string
  station?: string
  errors?: object
}

export interface SendMessage {
  command: string
  printerName?: string
  station?: string
  track1?: string
  track2?: string
  track3?: string
  firstName?: string
  lastName?: string
  isTakenAPicture?: string
  workerNumber?: string
  cardType?: string
}

export const Command = {
  MOVE_TO: 'moveTo',
  PRINT_MAG: 'printMag',
  PRINT_IMAGE: 'printImage',
  PRINT_COMBO: 'printCombo',
  CLOSE: 'close'
}

export const Station = {
  ICLASS: 'iCLASS',
  MAGNETIC: 'Magnetic',
  EJECT: 'Eject',
}

export const PrinterStatus = {
  SUCCESS: `Success`,
  FAILED: `Failed`
}

export const CardType = {
  EMPLOYEE_CARD: `employee`,
  DRIVER_CARD: `driver`,
  RAV_KAV: `ravKav`
}

@Injectable({
  providedIn: 'root'
})
export class PrinterService {

  public messages: Subject<SendMessage | ReceivePrinterMessage>

  constructor(private wsService: WebsocketService, private storeService: StoreService) {
    this.messages = <Subject<SendMessage | ReceivePrinterMessage>>wsService.connect(PRINTER_URL).pipe(map(
      (response: MessageEvent): ReceivePrinterMessage => {
        let data = JSON.parse(response.data)

        switch (data.command) {
          case "moveTo":
            return this.handleMessage(data)
          case "printMag":
            return this.handleMessage(data)
          case "printImage":
            return this.handleMessage(data)
          case "printCombo":
            return this.handleMessage(data)
          case "disconnect":
            return this.handleMessage(data)
        }
      }
    ))
  }


  private handleMessage(message: ReceivePrinterMessage): ReceivePrinterMessage {
    let status = {
      command: message.command,
      status: message.status,
      station: message.station,
      errors: message.errors
    }
    return status
  }

  public moveTo(station: string): Promise<ReceivePrinterMessage> {
    return new Promise(async resolve => {
      debugger
      this.messages.next({
        command: Command.MOVE_TO,
        printerName: ( JSON.parse(await this.storeService.get("printerSettings")) as OtherDevicesPayload).deviceSerNum,
        station: station
      })
      this.messages.subscribe((msg: any) => {
        console.log("Response from websocket: ")
        console.log(msg)
        resolve(msg)
      })
    })
  }

  public printMag(firstName: string, lastName: string, workerNumber: string, isTakenAPicture: string, cardType: string, track2: string): Promise<ReceivePrinterMessage> {
    return new Promise(async resolve => {
      this.messages.next({
        command: Command.PRINT_MAG,
        printerName: ( JSON.parse(await this.storeService.get("printerSettings")) as OtherDevicesPayload).deviceSerNum,
        firstName: firstName,
        lastName: lastName,
        workerNumber: workerNumber,
        isTakenAPicture: isTakenAPicture,
        cardType: cardType,
        track2: track2,

      })
      this.messages.subscribe((msg: any) => {
        console.log("Response from websocket: ")
        console.log(msg)
        resolve(msg)
      })
    })
  }

  public printImage(firstName: string, lastName: string, workerNumber: string, isTakenAPicture: string, cardType: string): Promise<ReceivePrinterMessage> {
    return new Promise(async resolve => {
      this.messages.next({
        command: Command.PRINT_IMAGE,
        printerName: ( JSON.parse(await this.storeService.get("printerSettings")) as OtherDevicesPayload).deviceSerNum,
        firstName: firstName,
        lastName: lastName,
        workerNumber: workerNumber,
        isTakenAPicture: isTakenAPicture,
        cardType: cardType
      })
      this.messages.subscribe((msg: any) => {
        console.log("Response from websocket: ")
        console.log(msg)
        resolve(msg)
      })
    })
  }

  public printCombo(firstName: string, lastName: string, workerNumber: string, isTakenAPicture: string, cardType: string, track2: string): Promise<ReceivePrinterMessage> {
    return new Promise(async resolve => {
      this.messages.next({
        command: Command.PRINT_COMBO,
        printerName: ( JSON.parse(await this.storeService.get("printerSettings")) as OtherDevicesPayload).deviceSerNum,
        firstName: firstName,
        lastName: lastName,
        workerNumber: workerNumber,
        isTakenAPicture: isTakenAPicture,
        cardType: cardType,
        track2: track2
      })
      this.messages.subscribe((msg: any) => {
        console.log("Response from websocket: ")
        console.log(msg)
        resolve(msg)
      })
    })
  }

}

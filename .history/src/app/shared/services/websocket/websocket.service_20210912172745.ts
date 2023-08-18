import { Injectable } from '@angular/core'
import { NavController } from '@ionic/angular'
import { TranslateService } from '@ngx-translate/core'
import * as Rx from "rxjs/"
import { delay } from 'rxjs/operators';
import { MyElectronService } from '../electron/my-electron.service'
import { StoreService } from '../store/store.service'

const READER_URL = 'ws://localhost/'
const PRINTER_URL = 'ws://localhost:443/'


@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  wsReader: WebSocket
  wsPrinter: WebSocket
  refusedConnect: number = 0

  constructor(
    private myElectronService: MyElectronService,
    private navController: NavController,
    private storeService: StoreService,
  ) { }

  private readerSubject: Rx.Subject<MessageEvent>
  private printerSubject: Rx.Subject<MessageEvent>


  public connect(url): Rx.Subject<MessageEvent> {

    if (url === READER_URL) {
      if (!this.readerSubject) {
        this.readerSubject = this.createReader(url)
        console.log("Successfully connected: " + url)
        return this.readerSubject
      }
    }

    if (url === PRINTER_URL) {
      if (!this.printerSubject) {
        this.printerSubject = this.createPrinter(url)
        console.log("Successfully connected: " + url)
        return this.printerSubject
      }
    }

  }

  private createReader(url): Rx.Subject<MessageEvent> {
    this.wsReader = new WebSocket(url)
    console.log("***CREATED WEBSOCKET")

    let observable = new Rx.Observable((obs: Rx.Observer<MessageEvent>) => {
      this.wsReader.onmessage = obs.next.bind(obs)
      this.wsReader.onerror = obs.error.bind(obs)
      this.wsReader.onclose = obs.complete.bind(obs)

      return this.wsReader.close.bind(this.wsReader)
    })
    let observer = {
      next: async (data: Object) => {

        if (this.wsReader.readyState === WebSocket.OPEN) {
          this.wsReader.send(JSON.stringify(data))
        }

        if (this.wsReader.readyState === WebSocket.CLOSED) {
          console.log("***WEBSOCKET CLOSED")
         await this.myElectronService.runReaderJar()
        }
      }
    }
    return Rx.Subject.create(observer, observable)
  }

  private createPrinter(url): Rx.Subject<MessageEvent> {

    this.wsPrinter = new WebSocket(url)
    console.log("***CREATED WEBSOCKET")

    let observable = new Rx.Observable((obs: Rx.Observer<MessageEvent>) => {
      this.wsPrinter.onmessage = obs.next.bind(obs)
      this.wsPrinter.onerror = obs.error.bind(obs)
      this.wsPrinter.onclose = obs.complete.bind(obs)

      return this.wsPrinter.close.bind(this.wsPrinter)
    })
    let observer = {
      next: async (data: Object) => {


        if (this.wsPrinter.readyState === WebSocket.OPEN) {
          this.wsPrinter.send(JSON.stringify(data))
        }

        if (this.wsPrinter.readyState === WebSocket.CLOSED) {
          console.log("***WEBSOCKET CLOSED")
          await this.myElectronService.runPrinterJar()
        }
      }
    }
    return Rx.Subject.create(observer, observable)
  }
}

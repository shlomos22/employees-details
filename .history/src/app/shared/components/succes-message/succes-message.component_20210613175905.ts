import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../services/modal/modal.service';
import { Command, PrinterService, Station } from '../../services/printer/printer.service';
import { OtherDevice } from '../../services/settings/settings.service';
import { StoreService } from '../../services/store/store.service';

@Component({
  selector: 'app-succes-message',
  templateUrl: './succes-message.component.html',
  styleUrls: ['./succes-message.component.scss']
})
export class SuccesMessageComponent implements OnInit {

  constructor(private modalService: ModalService, private printerService: PrinterService,private storeService: StoreService) { }

  ngOnInit() {
  }

  public async close() {
    this.modalService.dismiss()
    this.printerService.messages.next({
      command: Command.MOVE_TO,
      printerName: (await this.storeService.get("printerSettings") as OtherDevice).deviceSerNum,
      station: Station.EJECT
    })
    this.printerService.messages.subscribe(msg => {
      console.log("Response from websocket: ")
      console.log(msg)
    })
  }

}

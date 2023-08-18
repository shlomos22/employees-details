import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../services/modal/modal.service';
import { Command, PrinterService, Station } from '../../services/printer/printer.service';
import { StoreService } from '../../services/store/store.service';

@Component({
  selector: 'app-succes-message',
  templateUrl: './succes-message.component.html',
  styleUrls: ['./succes-message.component.scss']
})
export class SuccesMessageComponent implements OnInit {

  constructor(private modalService: ModalService, private printerService: PrinterService) { }

  ngOnInit() {
  }

  public async close() {
    this.modalService.dismiss()
    this.printerService.moveTo(Station.EJECT)
  }

}

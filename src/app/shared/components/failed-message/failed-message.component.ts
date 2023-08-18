import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ModalService } from '../../services/modal/modal.service';
import { Command, PrinterService, Station } from '../../services/printer/printer.service';

@Component({
  selector: 'app-failed-message',
  templateUrl: './failed-message.component.html',
  styleUrls: ['./failed-message.component.scss']
})
export class FailedMessageComponent implements OnInit {

  @Input() message: string

  constructor(
    private modalService: ModalService,
    private translateService: TranslateService,
    private printerService: PrinterService,
    ) {}

  ngOnInit() {
    this.initializeMessages(this.message)
  }

  public async close() {
    this.modalService.dismiss()
    this.printerService.moveTo(Station.EJECT)
  }

  initializeMessages(message: any) {
   this.message = this.translateService.instant(`Errors.${message}`)
  }

}

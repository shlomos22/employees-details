import { Component, Input, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core'
import { PrinterService, ReceivePrinterMessage } from '../../services/printer/printer.service';
import { ReaderService, ReceiveReaderMessage } from '../../services/reader/reader.service';

export interface Steps {
  command: string,
  isActive: boolean
}

@Component({
  selector: 'app-progress-process',
  templateUrl: './progress-process.component.html',
  styleUrls: ['./progress-process.component.scss']
})
export class ProgressProcessComponent implements OnDestroy {

  @Input() steps: Steps[]
  @Input() msg: any
  interval: any;
  image: string
  message: string

  constructor(
    private translateService: TranslateService
  ) {
    this.image = 'assets/card-start.png'
    this.message = this.translateService.instant('App.ProgressProcess.Messages.start')
    this.next()
  }

  ngOnDestroy(): void {
    clearInterval(this.interval)
  }

  public async next() {

    this.steps.forEach(step => {
      // if (step === msg.command) {
      //   step.isActive = true
      // }
    })

    switch (this.msg.command) {
      case 'reader':
      case 'readIsrDriverCard':
      case 'writeIsrDriverCard':
        this.message = this.translateService.instant('App.ProgressProcess.Messages.contactles')
        break
      case 'moveTo':
       console.log(this.msg);
        break
      case 'printMag':
      case 'printImage':
      case 'printCombo':
        this.message = this.translateService.instant('App.ProgressProcess.Messages.printing')
        break
    }
    this.interval = setInterval(() => this.next(), 500);
  }
}



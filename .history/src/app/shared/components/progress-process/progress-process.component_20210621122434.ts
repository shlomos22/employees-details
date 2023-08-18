import { AfterContentInit, Component, Input, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { interval } from 'rxjs';
import { PrinterService } from '../../services/printer/printer.service';
import { ReaderService } from '../../services/reader/reader.service';

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
  interval = interval(1000)
  image: string
  message: string

  constructor(
    private readerService: ReaderService,
    private printerService: PrinterService,
    private translateService: TranslateService
  ) {
    this.image = 'assets/card-start.png'
    this.message = this.translateService.instant('App.ProgressProcess.Messeges.start')
  }

  ngOnDestroy(): void {
    this.interval.subscribe().closed
  }

  public next() {
    debugger
    let msg: any = this.readerService.messages.subscribe(msg => { return msg; })
    if (!msg)
      msg = this.printerService.messages.subscribe(msg => { return msg; })

    this.steps.find(step => {
      if (step === msg.command) {
        step.isActive = true
      }
    })

    switch (msg.command) {
      case 'reader':
      case 'readIsrDriverCard':
      case 'writeIsrDriverCard':
        this.message = this.translateService.instant('App.ProgressProcess.Messeges.contactles')
        break
      case 'moveTo':
      case 'printMag':
      case 'printImage':
      case 'printCombo':
        this.message = this.translateService.instant('App.ProgressProcess.Messeges.printing')
        break
    }
    this.interval.subscribe(() => this.next())
  }
}



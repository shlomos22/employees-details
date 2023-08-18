import { AfterContentInit, Component, Input, OnInit, OnDestroy } from '@angular/core';
import { interval } from 'rxjs';
import { PrinterService } from '../../services/printer/printer.service';
import { ReaderService } from '../../services/reader/reader.service';
import { Command } from '../../../../../.history/src/app/shared/services/printer/printer.service_20210610154135';

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

  constructor(private readerService: ReaderService, private printerService: PrinterService) {

  }

  ngOnDestroy(): void {
    this.interval.subscribe().closed
  }





  public next() {

    let msg: any = this.readerService.messages.subscribe(msg => { return msg; })

    if (!msg)
      msg = this.printerService.messages.subscribe(msg => { return msg; })

    switch (msg.command) {
      case 'start':
        this.image = 'assets/'
        break
      case 'reader':
        break
      case 'readIsrDriverCard':
        break
      case 'writeIsrDriverCard':
        break
      case 'moveTo':
        break
      case 'printMag':
        break
      case 'printImage':
        break
      case 'printCombo':
        break
      case 'end':
        break
      default:
        break;
    }


    this.interval.subscribe(() => this.next())
  }
}



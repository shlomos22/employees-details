import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core'

export interface Steps {
  command: string,
  isActive: boolean
}

@Component({
  selector: 'app-progress-process',
  templateUrl: './progress-process.component.html',
  styleUrls: ['./progress-process.component.scss']
})
export class ProgressProcessComponent implements OnChanges {

  @Input() steps: Steps[]
  @Input() msg: any

  image: string
  message: string

  constructor(
    private translateService: TranslateService
  ) {
    this.steps.forEach(step => {
      console.log(step.command);

    });

    this.image = 'assets/card-start.png'
    this.message = this.translateService.instant('App.ProgressProcess.Messages.start')
    this.next()
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.msg = changes.msg.currentValue
  }

  public async next() {

    if (this.msg) {
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
    }

    // this.interval = setInterval(() => this.next(), 1000);
  }

}


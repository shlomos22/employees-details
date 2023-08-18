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
    this.image = 'assets/card-start.png'
    this.message = this.translateService.instant('App.ProgressProcess.Messages.start')

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.msg = changes.msg.currentValue
    this.steps = changes.steps.currentValue
    this.next()
  }

  public async next() {

    let start = this.steps.find(step => step.command === 'start')


    start.isActive = true

    if (this.msg) {
      switch (this.msg.command) {
        case 'reader':
          let reader = this.steps.find(step => step.command === 'reader')
          reader.isActive = true
          break
        case 'readIsrDriverCard':
          let readIsrDriverCard = this.steps.find(step => step.command === 'readIsrDriverCard')
          readIsrDriverCard.isActive = true
          break
        case 'writeIsrDriverCard':
          this.message = this.translateService.instant('App.ProgressProcess.Messages.contactles')
          let writeIsrDriverCard = this.steps.find(step => step.command === 'writeIsrDriverCard')
          writeIsrDriverCard.isActive = true
          break
        case 'moveTo':
          if (this.msg.station === 'Rady') {
            this.message = this.translateService.instant('App.ProgressProcess.Messages.end')
            let end = this.steps.find(step => step.command === 'end')
            end.isActive = true
          }
          break
        case 'printMag':
          let printMag = this.steps.find(step => step.command === 'printMag')
          printMag.isActive = true
          break
        case 'printImage':
          let printImage = this.steps.find(step => step.command === 'printImage')
          printImage.isActive = true
          break
        case 'printCombo':
          this.message = this.translateService.instant('App.ProgressProcess.Messages.printing')
          let printCombo = this.steps.find(step => step.command === 'printCombo')
          printCombo.isActive = true
          break
      }
    }

    // this.interval = setInterval(() => this.next(), 1000);
  }

}


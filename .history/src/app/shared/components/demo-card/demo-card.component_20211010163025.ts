import { Component, Input, OnInit } from '@angular/core'
import { ImageCroppedEvent } from 'ngx-image-cropper'
import { OPERATOR } from '../../constants/Config'


const CardType  = {
  DRIVER_TYPE: 'כרטיס נהג',
  EMPLOYEE_TYPE: 'כרטיס עובד'
}

@Component({
  selector: 'app-demo-card',
  templateUrl: './demo-card.component.html',
  styleUrls: ['./demo-card.component.scss']
})
export class DemoCardComponent implements OnInit {

  @Input() picture: ImageCroppedEvent
  @Input() workerName: string
  @Input() workerType: string[]
  @Input() workerNumber: string

  cardType: string
  style: string

  constructor() {
    this.style =`background-image: url("${OPERATOR.CARD_IMAGE}")`
  }

  ngOnInit() {
    this.getWorkerType()
  }

  private getWorkerType(): void {
    let driver = this.workerType.includes('driver') ?? false
    let employee = this.workerType.includes('employee') ?? false

    if (driver && !employee) {
      this.cardType = CardType.DRIVER_TYPE
    } else if (!driver && employee) {
      this.cardType = CardType.EMPLOYEE_TYPE
    } else if (driver && employee) {
      this.cardType = CardType.EMPLOYEE_TYPE
    }
  }
}

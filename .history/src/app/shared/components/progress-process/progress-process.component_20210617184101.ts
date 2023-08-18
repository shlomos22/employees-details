import { AfterContentInit, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ReceivePrinterMessage } from '../../services/printer/printer.service';
import { ReceiveReaderMessage } from '../../services/reader/reader.service';

@Component({
  selector: 'app-progress-process',
  templateUrl: './progress-process.component.html',
  styleUrls: ['./progress-process.component.scss']
})
export class ProgressProcessComponent implements AfterContentInit {

  @Input() cardType: string
  @Input() obj: Observable<ReceiveReaderMessage | ReceivePrinterMessage>
  message: ReceiveReaderMessage | ReceivePrinterMessage
  steps: number[]

  constructor() {

  }

  ngAfterContentInit(): void {
    if (this.obj) {
      this.obj.pipe().subscribe(message => this.message = message)
    }
  }



  public next() {




    // if (step === 'step1') {
    //   step = 'step2';
    //   step1.classList.remove("is-active");
    //   step1.classList.add("is-complete");
    //   step2.classList.add("is-active");

    // } else if (step === 'step2') {
    //   step = 'step3';
    //   step2.classList.remove("is-active");
    //   step2.classList.add("is-complete");
    //   step3.classList.add("is-active");

    // } else if (step === 'step3') {
    //   step = 'step4d';
    //   step3.classList.remove("is-active");
    //   step3.classList.add("is-complete");
    //   step4.classList.add("is-active");

    // } else if (step === 'step4d') {
    //   step = 'complete';
    //   step4.classList.remove("is-active");
    //   step4.classList.add("is-complete");

    // } else if (step === 'complete') {
    //   step = 'step1';
    //   step4.classList.remove("is-complete");
    //   step3.classList.remove("is-complete");
    //   step2.classList.remove("is-complete");
    //   step1.classList.remove("is-complete");
    //   step1.classList.add("is-active");
    // }
  }

}



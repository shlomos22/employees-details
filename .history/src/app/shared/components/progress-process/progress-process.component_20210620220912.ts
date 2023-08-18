import { AfterContentInit, Component, Input, OnInit, OnDestroy } from '@angular/core';
import { interval } from 'rxjs';

@Component({
  selector: 'app-progress-process',
  templateUrl: './progress-process.component.html',
  styleUrls: ['./progress-process.component.scss']
})
export class ProgressProcessComponent implements OnDestroy {

  @Input() steps: string[]
  interval = interval(1000)

  constructor() {

  }

  ngOnDestroy(): void {
    this.interval
  }





  public next() {


    this.interval.subscribe(()=> this.next())
  }
}



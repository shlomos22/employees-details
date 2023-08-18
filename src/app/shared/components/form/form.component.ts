import { Component, Input, OnInit } from '@angular/core'
import { Employee } from '../../services/employee/employee.service'

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  @Input() inputs: Employee


  showPinCode: boolean = false

  constructor() { }

  ngOnInit() {
  }

}

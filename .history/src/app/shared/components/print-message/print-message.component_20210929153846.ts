import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../services/modal/modal.service';

@Component({
  selector: 'app-print-message',
  templateUrl: './print-message.component.html',
  styleUrls: ['./print-message.component.scss']
})
export class PrintMessageComponent implements OnInit {

  constructor(private modalService: ModalService) { }

  ngOnInit(): void {
  }

}

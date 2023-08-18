import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../services/modal/modal.service';

@Component({
  selector: 'app-succes-message',
  templateUrl: './succes-message.component.html',
  styleUrls: ['./succes-message.component.scss']
})
export class SuccesMessageComponent implements OnInit {

  constructor(private modalService: ModalService) { }

  ngOnInit() {
  }

  public close() {
    this.modalService.dismiss()
  }

}

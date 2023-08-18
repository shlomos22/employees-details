import { Component, Input, OnInit } from '@angular/core';
import domtoimage from 'dom-to-image';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-demo-card-to-save',
  templateUrl: './demo-card-to-save.component.html',
  styleUrls: ['./demo-card-to-save.component.scss']
})
export class DemoCardToSaveComponent implements OnInit {

  @Input() picture: ImageCroppedEvent
  @Input() userName: string

  constructor() { }

  ngOnInit() {
  }

  public createCardImage() {

    domtoimage.toPng(document.getElementById('card'))
      .then(dataUrl => {
        var link = document.createElement('a');
        link.download = 'my-image-name.png';
        link.href = dataUrl;
        link.click();
      })
      .catch(function (error) {
        console.error('oops, something went wrong!', error);
      });
  }

}

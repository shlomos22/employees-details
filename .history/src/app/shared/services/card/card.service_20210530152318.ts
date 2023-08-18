import { Injectable, ViewChild } from '@angular/core';
import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  @ViewChild('card') card: HTMLElement

  constructor() { }

  public createCardImage() {
    htmlToImage.toPng(this.card)
      .then(dataUrl => {
        var link = document.createElement('a');
        link.download = 'card.jpeg';
        link.href = dataUrl;
        link.click();
      })
      .catch(error => {
        console.error('oops, something went wrong!', error);
      });
  }

}

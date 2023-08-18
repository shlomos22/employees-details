import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { CameraComponent } from './components/camera/camera.component';
import { PopoverComponent } from '../pages/home/components/popover/popover.component';
import { FormComponent } from './components/form/form.component';
import { DemoCardComponent } from './components/demo-card/demo-card.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ImageCropperModule } from 'ngx-image-cropper';
import { WebcamModule } from 'ngx-webcam';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { PipeModule } from './pipes/pipe.module';
import { SuccesMessageComponent } from './components/succes-message/succes-message.component';
import { FailedMessageComponent } from './components/failed-message/failed-message.component';
import { PrintMessageComponent } from './components/print-message/print-message.component';



const components = [
  CameraComponent,
  PopoverComponent,
  FormComponent,
  DemoCardComponent,
  SuccesMessageComponent,
  FailedMessageComponent,
  PrintMessageComponent
];

const directives = [];

@NgModule({
  declarations: [...components, ...directives, PrintMessageComponent],
  exports: [...components, ...directives],
  imports: [
    IonicModule,
    CommonModule,
    WebcamModule,
    ImageCropperModule,
    NgSelectModule,
    PipeModule,
    FormsModule,
    TranslateModule
  ]
})
export class SharedModule { }

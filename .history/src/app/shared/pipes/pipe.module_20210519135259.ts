import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsInputPipe } from './settings-input.pipe';



@NgModule({
  imports: [
    // CommonModule
  ],
  exports: [
    SettingsInputPipe
  ],
  declarations: [
    SettingsInputPipe
   ]
})
export class PipeModule { }

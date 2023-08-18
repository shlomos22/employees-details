import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'settingsInput'
})
export class SettingsInputPipe implements PipeTransform {

  transform(selected: any): any {
    debugger
    if (!selected)
      return null

    return selected.deviceDescr
  }

}

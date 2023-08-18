import { Injectable } from '@angular/core';
import { ElectronService } from '../../../core/services/electron/electron.service';
import { DEFAULT, DevicesPayload, DEVICE_TYPE, SettingsReportRequest } from '../../../pages/settings/settings.page';
import { version, name } from '../../../../../package.json';
import { HttpService } from '../http/http.service';
import { AlertService } from '../alert/alert.service';
import { take } from 'rxjs/operators';
import { OK } from '../../constants/URLs';
import { ToastService } from '../toast/toast.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  uuid: any

  constructor(
    private electronService: ElectronService,
    private httpService: HttpService,
    private alertService: AlertService,
    private toastService: ToastService,
  ) { }

  public getUUID() {
    this.electronService.si.system().then(data => this.uuid = data.uuid).catch(error => console.error(error))
  }

  public async updateDevice(): Promise<void> {
    const data: DevicesPayload = {
      deviceSerialNumber: this.uuid, vehicleNumber: DEFAULT, samNumber: DEFAULT, status_id: DEFAULT, appName: name,
      appVersion: version, deviceAndroidVersion: DEFAULT, deviceAndroidModel: DEFAULT, simSerialNumber: DEFAULT,
      spmSerialNum: DEFAULT, deviceType: DEVICE_TYPE, deviceDescr: DEFAULT
    };
    const addDevicesPayload: SettingsReportRequest = { data: data };
    (await this.httpService.updateDevice(addDevicesPayload)).pipe(take(1))
      .subscribe(
        res => {
          if (res.statusCode != OK) {
            console.error("status code: " + res.statusCode);
            console.error("description: " + res.description);
            this.toastService.displayToast(res.descriptionForUserHE, 3 * 1000, "danger");
            return;
          }

        },
        error => this.alertService.displayErrorFromServer(error),
      )
  }
}
